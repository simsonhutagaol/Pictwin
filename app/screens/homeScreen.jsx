import React, { useContext, useEffect } from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import SpecifiedView from '../components/SpecifiedView';
import { useMutation, useQuery } from "@apollo/client";
import { GET_POSTS, GET_MY_PROFILE, LIKES_POST } from '../queries';
import { LoginContext } from "../contexts/LoginContext";


export default  function Home({ navigation }) {
  const {setDataLogin,setIsLoggedIn} = useContext(LoginContext)
  //data posts
  const {loading,error,data:dataPosts,refetch} = useQuery(GET_POSTS)
  //data login
  const {data} = useQuery(GET_MY_PROFILE,{
    onCompleted:(data)=>{
      setDataLogin(data)
    },
  })
  



  if(loading){
    return(
      <SpecifiedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SpecifiedView>
    )
  }

  return (
    <SpecifiedView style={styles.container}>
      <FlatList
        data={dataPosts?.getPosts}
        keyExtractor={(item) => item?._id.toString()}
        renderItem={({ item }) => (
            <PostCard post={item} data={data} navigation={navigation} refetchPosts={refetch}/>
        )}
      />
    </SpecifiedView>
  );
}

const PostCard = ({ post ,navigation,data,refetchPosts}) => {
  const [dispatc, { error }] = useMutation(LIKES_POST,{
    onCompleted:()=>{
      refetchPosts()
      navigation.navigate("DetailPost", { postId: post._id })
    },
  });

  const handleLike = async () => {
    await dispatc({
      variables: {
        id:post._id
      }
    });
  };
  const isLike = post?.likes?.some((el) => {
    return el.username == data?.getUserById?.username;
  });

  return (
    <SpecifiedView style={styles.card}>
      <TouchableOpacity onPress={() =>{
              if(data?.getUserById?._id == post.authorId){
                navigation.navigate('Profile')
              }else{
                navigation.navigate('DetailProfile', { postId: post.authorId })
              }
          }}
      >
      <SpecifiedView style={styles.profile}>
        <Image source={{ uri: post.authorName.imgUrl }} style={styles.profilePic} />
        <Text style={styles.username}>{post.authorName.username}</Text>
      </SpecifiedView>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate("DetailPost", { postId: post._id })}>
        <Image source={{ uri: post.imgUrl }} style={styles.image} />
      </TouchableOpacity>
      <SpecifiedView style={styles.interactions}>
        <TouchableOpacity style={styles.iconContainer}  onPress={()=>!isLike?handleLike():false}>
        <Ionicons
          // name="heart-outline"
          name={isLike?"heart":"heart-outline"}
          size={25}
          color="black"
          style={{ marginLeft: 10 }}
        />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
        <Ionicons
        onPress={()=>navigation.navigate("DetailPost", { postId: post._id })}
          name="chatbubble-outline"
          size={25}
          color="black"
          style={{ marginRight: 300 }}
        />
        </TouchableOpacity>
      </SpecifiedView>
      <Text style={styles.caption}>{post.content}</Text>
    </SpecifiedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  card: {
    padding: 10,
    width: '100%',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    margin:10,
    
  },
  profilePic: {
    width: "8%",
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 300,
    // left: '-10%',
    // right: '-10%',
    marginBottom: 10,
  },
  interactions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caption: {
    fontSize: 16,
    margin:10
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
