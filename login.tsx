import { useRouter } from "expo-router"; 
import { useState } from "react";
import { Text, SafeAreaView, TextInput, StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebaseConfig"; 

export default function Login() {
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);

  const handleFirebaseLogin = async () => {
    setIsLoading(true); 
    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;
      Alert.alert("Success", `Welcome back, ${user.email}!`);
      router.push('/home'); 
    } catch (error) {
      let errorMessage = "Account does not exist.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found for this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleSubmit = () => {
    let valid = true;

    if (!email.endsWith('@gmail.com')) {
      setEmailError('Email must end with @gmail.com');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      handleFirebaseLogin(); 
    }
  };

  const handleSignUp = () => {
    router.push('/register'); // Redirects to the index.tsx page
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Meysmook Login</Text>

        <TextInput
          style={styles.inputStyle}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter Password"
            secureTextEntry={!showPassword} 
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="black" />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity style={styles.baseButtonStyle} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isLoading ? "Loading..." : "Confirm"}</Text>
        </TouchableOpacity>

        {/* Sign-Up Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpText}>Sign-Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: 'blue',
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  baseButtonStyle: {
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#007bff",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  signUpButton: {
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
    padding: 10,
    backgroundColor: "green", // Green button for "Sign-Up"
    marginTop: 10,
  },
  signUpText: {
    color: "white",
    fontWeight: "bold",
  },
  formContainer: {
    borderWidth: 1,
    padding: 20,
    borderRadius: 6,
    minWidth: 300,
    backgroundColor: "#f8f8f8",
  },
  inputStyle: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    backgroundColor: "white",
    marginBottom: 10,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "white",
    marginBottom: 10,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 8,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
});
