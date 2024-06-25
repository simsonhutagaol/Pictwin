import React, { useContext, useState } from "react";
import { 
  TouchableWithoutFeedback,
  TouchableOpacity,StyleSheet, 
  Text, 
  View, 
  Button, 
  Image, 
  FlatList, 
  ScrollView,
  Modal 
} from "react-native";
import { LoginContext } from "../contexts/LoginContext";

export default function Profile({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const {dataLogin} = useContext(LoginContext)
  const data = dataLogin

  const toggleModal = (type) => {
    setIsModalVisible(!isModalVisible);
    setModalType(type);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Image
          style={styles.profileImage}
          source={{ uri: data?.getUserById?.imgUrl }} 
        />
        
        <View style={styles.stats} >
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{data?.getUserById?.posts?.length}</Text> 
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{data?.getUserById?.follower?.length}</Text> 
            <TouchableOpacity onPress={() => toggleModal('followers')}>
            <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{data?.getUserById?.following?.length}</Text> 
            <TouchableOpacity onPress={() => toggleModal('following')}>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => toggleModal(null)}
      >
        <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
           <TouchableOpacity onPress={() => toggleModal(null)}>
            <Text style={styles.modalHeaderText}>Close</Text>
          </TouchableOpacity>
        </View>

          <View style={styles.modalContent}>
            <FlatList
              data={modalType === 'followers' ? data?.getUserById?.follower : data?.getUserById?.following}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity >
                  <Text onPress={()=>{
                      navigation.navigate("DetailProfile",{postId:item._id})}
                    }
                  >
                    - {item.username}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      <View>
        <Text style={styles.text}>Username: {data?.getUserById?.name}</Text>
      </View>
      <View>
        <Text style={styles.text}>Name: {data?.getUserById?.username}</Text>
      </View>
      <View>
        <Text style={styles.text}>Email: {data?.getUserById?.email}</Text>
      </View>
      <Text style={styles.text}>Posts :</Text>
      {data?.getUserById?.posts && data?.getUserById?.posts.length > 0 ? (
        <View style={styles.postContainer}>
          <FlatList
            data={data?.getUserById?.posts}
            numColumns={3}
            keyExtractor={(item) => item?._id?.toString()}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => navigation.navigate("DetailPost", { postId: item?._id })}>
                <Image style={styles.postImage} source={{ uri: item?.imgUrl }} />
              </TouchableWithoutFeedback>
              )}
          />
        </View>
      ) : (
        <Text style={styles.emptyPostsText}>No posts available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor:"white"
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 20,
    padding: 20
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontWeight: "bold",
    fontSize: 18,
  },
  statLabel: {
    color: "gray",
  },
  postImage: {
    width: '35%', 
    aspectRatio: 1, 
    margin: 1, 
    left: '-10%',
    right: '-10%',
    resizeMode: 'cover',
  },
  postContainer: {
    flex: 1,
    margin: 2,
  },
  text:{
    // paddingVertical: 10,
    // alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
  },
  
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  modalHeaderText: {
    color: "blue",
    fontWeight: "bold",
  },
  emptyPostsText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
});
