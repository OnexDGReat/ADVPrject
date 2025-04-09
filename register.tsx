import { useRouter } from "expo-router"; 
import { useEffect, useState } from "react";
import { Text, SafeAreaView, TextInput, StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebaseConfig"; // Ensure this points to your Firebase config file

export default function Index() {
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidPassword = (pwd: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20}$/.test(pwd);

  const handleFirebaseRegister = async () => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;
      Alert.alert("Success", `Welcome ${user.email}!`);
      setTimeout(() => {
        router.push('/login'); 
      }, 500); 
    } catch (error) {
      let errorMessage = "An error occurred.";
      if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "This account already exists.";
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

    if (!isValidPassword(password)) {
      setPasswordError('Password must be 8-20 characters, include uppercase, lowercase, and a special character.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (valid) {
      handleFirebaseRegister();
    }
  };

  useEffect(() => {
    if (email && email.endsWith('@gmail.com')) {
      setEmailError('');
      setIsEmailValid(true);
    } else {
      setEmailError(email ? 'Email must end with @gmail.com' : '');
      setIsEmailValid(false);
    }
  }, [email]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}> Meysmook Register </Text>

        <TextInput
          style={styles.inputStyle}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        {isEmailValid ? <Text style={styles.validText}>Email is Valid</Text> : null}

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

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Re-Enter Password"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            <Icon name={showConfirmPassword ? "eye" : "eye-slash"} size={20} color="black" />
          </TouchableOpacity>
        </View>
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

        <TouchableOpacity style={styles.baseButtonStyle} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isLoading ? "Loading..." : "Confirm"}</Text>
        </TouchableOpacity>

        {/* Added text and navigation to login page */}
        <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginRedirect}>
          <Text style={styles.redirectText}>Already have an account?</Text>
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
  validText: {
    color: "green",
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
  loginRedirect: {
    marginTop: 15,
    alignItems: "center",
  },
  redirectText: {
    color: "#007bff",
    fontSize: 14,
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
    marginBottom: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "white",
    marginBottom: 5,
  },
  passwordInput: {
    flex: 1,
    padding: 8,
  },
  eyeIcon: {
    padding: 10,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
