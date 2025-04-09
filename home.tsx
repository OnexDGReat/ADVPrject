import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH, db } from "./firebaseConfig";

 // Ensure auth is exported from firebaseConfig
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { router } from "expo-router";

// Type for grocery item
type GroceryItem = {
  id: string;
  name: string;
  quantity: number;
};

const GroceryScreen = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const navigation = useNavigation(); // Navigation object

  const groceriesRef = collection(db, "groceries");

  useEffect(() => {
    const q = query(groceriesRef, orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groceries: GroceryItem[] = [];
      snapshot.forEach((docSnap) => {
        groceries.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<GroceryItem, "id">),
        });
      });
      setItems(groceries);
    });

    return unsubscribe;
  }, []);

  const handleAddOrUpdate = async () => {
    if (!name || !quantity) return;

    const item = {
      name,
      quantity: parseInt(quantity),
    };

    try {
      if (editId) {
        const docRef = doc(db, "groceries", editId);
        await updateDoc(docRef, item);
        setEditId(null);
      } else {
        await addDoc(groceriesRef, item);
      }
      setName("");
      setQuantity("");
    } catch (err) {
      Alert.alert("Error", "Could not save item");
    }
  };

  const handleEdit = (item: GroceryItem) => {
    setName(item.name);
    setQuantity(item.quantity.toString());
    setEditId(item.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "groceries", id));
    } catch (err) {
      Alert.alert("Error", "Could not delete item");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH); 
      Alert.alert("Success", "You have been logged out.");
      router.replace('/login'); 
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Grocery List</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Item name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdate}>
        <Text style={styles.addButtonText}>
          {editId ? "Update Item" : "Add Item"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.name} - {item.quantity}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  logoutButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  addButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 6,
    marginVertical: 6,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  edit: {
    color: "blue",
    marginRight: 15,
  },
  delete: {
    color: "red",
  },
});

export default GroceryScreen;
