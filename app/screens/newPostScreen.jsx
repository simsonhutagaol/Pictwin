import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button ,TouchableOpacity,ActivityIndicator} from "react-native";
import { ADD_POST, GET_MY_PROFILE } from "../queries";
import SpecifiedView from "../components/SpecifiedView";
import { GET_POSTS } from '../queries';

export default function NewPost({navigation}) {
  const [error,setError] = useState(null)
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState(""); 
  const [imgUrl, setImgUrl] = useState("");
  
  const [dispatcher,{loading}] = useMutation(ADD_POST,{
    onCompleted:()=>{
      navigation.navigate('Home');
    },
    refetchQueries: [
      { query: GET_POSTS},
      {query:GET_MY_PROFILE}
    ],
    awaitRefetchQueries: true,
  })

  const handlePost=async()=>{
    try {
      await dispatcher({
        variables:{
          input:{
            content,
            tags,
            imgUrl
          }
        }
      })
      
      
    } catch (error) {
      setError(error.message)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput]);
      setTagInput(""); 
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const renderTags = () => {
    return tags?.map((tag) => (
      <View style={styles.tag} key={tag}>
        <Text>{tag}</Text>
        <Button title="X" onPress={() => handleRemoveTag(tag)} />
      </View>
    ));
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
    <View style={styles.container}>
      <Text style={styles.label}>Content:</Text>
      <TextInput
        style={styles.input}
        multiline={true}
        numberOfLines={4}
        value={content}
        onChangeText={setContent}
      />

      <Text style={styles.label}>Tags:</Text>
      <View style={styles.tagsContainer}>
        {renderTags()}
        <TextInput
          style={styles.tagInput}
          placeholder="Add tag"
          value={tagInput}
          onChangeText={setTagInput}
          onSubmitEditing={handleAddTag}
        />
      </View>

      <Text style={styles.label}>Image URL:</Text>
      <TextInput
        style={styles.inputImage}
        value={imgUrl}
        onChangeText={setImgUrl}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor:"white",
    marginBottom:100
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  inputImage: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    minHeight: 100,
    maxHeight: 100
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 5,
  },
  tagInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    padding: 5,
    marginRight: 10,
    marginBottom: 5,
  },
  postButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#0095f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
});
