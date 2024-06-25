import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, TextInput,FlatList, TouchableOpacity, Image } from "react-native";
import { SEARCH_USER } from "../queries";
import { useLazyQuery } from "@apollo/client";
import { LoginContext } from "../contexts/LoginContext";

export default function Search({ navigation }) {
  const {dataLogin} = useContext(LoginContext)
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [dispatcher,{loading,data}] = useLazyQuery(SEARCH_USER,{
    onCompleted:(data)=>{
      setSearchResults(data.getUserByUserName);
    }
  })

  const handleSearch = async(searchText) => {
     setSearchQuery(searchText);
     if (searchText === '') {
      setSearchResults(null);
    } else {
      await dispatcher({
        variables:{
          search: searchText 
        }
      }); 
    }
  };

  return (
    <View style={{ flex: 1,backgroundColor:"white" }}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Username"
          value={searchQuery}
          onChangeText={handleSearch} 
        />
      </View>
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>Search Results:</Text>
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() =>{
                if(dataLogin?.getUserById?._id == item._id){
                  navigation.navigate('Profile')
                }else{
                  navigation.navigate('DetailProfile', { postId: item._id })
                }
              }}
            >
              <View style={styles.card}>
                <Image source={{ uri: item.imgUrl }} style={styles.profileImage} />
                <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.name}>{item.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.noResultsText}>No results found</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    height:150
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height:40
  },
  resultsContainer: {
    flex: 1,
    // paddingHorizontal: 20,
    // paddingTop: 20,
  },
  resultsText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    marginLeft:20
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    // padding: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    marginLeft:20
  },
  username: {
    fontSize: 16,
  },
  name: {
    fontSize: 10,
    color:"grey"
  },
  noResultsText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
