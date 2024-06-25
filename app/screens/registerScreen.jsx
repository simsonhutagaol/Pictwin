import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Text, StyleSheet,Image,ActivityIndicator } from 'react-native';
import { REGISTER } from '../queries';
import { useMutation } from "@apollo/client";
import SpecifiedView from '../components/SpecifiedView';

export default function RegisterScreen ({ navigation })  {
  const [error,setError] = useState("")
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imgUrl,setImgUrl] = useState('')

  const [dispatcher,{loading}] = useMutation(REGISTER,{
    onCompleted: () => {
      navigation.navigate("Login")
    },
  })

  const handleRegister = async() => {
    try {
      await dispatcher({
        variables: {
          input:{
            name,
            username,
            email,
            password,
            imgUrl
          }
        },
      });
    } catch (error) {
      setError(error.message)
    }
  };
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
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true} 
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Image Url"
        value={imgUrl}
        onChangeText={setImgUrl} 
        autoCapitalize="none"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
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
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  containerInput:{
    width:"90%",
    height:"50%"
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
  registerButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#0095f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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


