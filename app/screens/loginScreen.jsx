import React, { useState,useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet,Image, ActivityIndicator,} from 'react-native';
import { LoginContext } from "../contexts/LoginContext";
import { useMutation } from "@apollo/client";
import { DO_LOGIN } from '../queries';
import * as SecureStore from "expo-secure-store";
import SpecifiedView from '../components/SpecifiedView';

export default function LoginScreen ({ navigation }) {
  const [error,setError] = useState(null)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {setIsLoggedIn} = useContext(LoginContext)
  
  const[dispatcher,{loading}] = useMutation(DO_LOGIN,{
    onCompleted:async (data) => {
        if (data.login.token) {
          await SecureStore.setItemAsync("token", data.login.token);
          setIsLoggedIn(true)
        }
    },
  })

  const handleLogin = async() => {
    try {
      await dispatcher({
       variables: {
         input:{
           username,
           password
         }
       },
     });
    } catch (error) {
      setError(error.message)
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkToken();
  },[]);



  if (loading) {
    return (
      <SpecifiedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SpecifiedView>
    );
  }

  return (
    <SpecifiedView style={styles.container}>
      <Image
        source={require("../assets/Instagram_logo.png")}
        style={{ width: 200, height: 70, marginBottom:20 }}
      />
      <SpecifiedView style={styles.containerInput}>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none" 
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true} 
        autoCapitalize="none"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Don't have an account? Register here</Text>
      </TouchableOpacity>
      </SpecifiedView>
    </SpecifiedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  containerInput:{
    width: '90%',
  },

  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  loginButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#0095f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    marginTop: 10,
    color: '#0095f6',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});


