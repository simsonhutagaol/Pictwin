import React, { useContext, useState } from "react";
import { 
  TouchableWithoutFeedback, 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  View, 
  Button, 
  Image, 
  FlatList, 
  ScrollView, 
  Modal 
} from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { FOLLOW, GET_PROFILE, GET_MY_PROFILE } from "../queries";
import { LoginContext } from "../contexts/LoginContext";

export default function DetailProfile({ navigation, route }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const { dataLogin } = useContext(LoginContext);
  const { postId } = route.params;

  const toggleModal = (type) => {
    setIsModalVisible(!isModalVisible);
    setModalType(type);
  };

  const { data: dataUser } = useQuery(GET_PROFILE, {
    variables: { id: postId },
  });

  const [dispatcher, { loading, data, error }] = useMutation(FOLLOW, {
    refetchQueries: [
      { query: GET_PROFILE, variables: { id: postId } },
      { query: GET_MY_PROFILE},
    ],
    awaitRefetchQueries: true,
  });

  const handleFollow = async () => {
    await dispatcher({
      variables: {
        id: postId,
      },
    });
  };

  const isFollow = dataUser?.getUserById?.follower?.some((el) => {
    return el._id == dataLogin?.getUserById?._id;
  });

  const isFollower = dataUser?.getUserById?.following?.some((el) => {
    return el._id == dataLogin?.getUserById?._id;
  });

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Image style={styles.profileImage} source={{ uri: dataUser?.getUserById?.imgUrl }} />
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{dataUser?.getUserById?.posts?.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{dataUser?.getUserById?.follower?.length}</Text>
            <TouchableOpacity onPress={() => toggleModal("followers")}>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{dataUser?.getUserById?.following?.length}</Text>
            <TouchableOpacity onPress={() => toggleModal("following")}>
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
              data={modalType === "followers" ? dataUser?.getUserById?.follower : dataUser?.getUserById?.following}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate("DetailProfile", { postId: item._id })}>
                  <Text>- {item.username}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      <View>
        <Text style={styles.text}>Username: {dataUser?.getUserById?.username}</Text>
      </View>
      <View>
        <Text style={styles.text}>Name: {dataUser?.getUserById?.name}</Text>
      </View>
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: !isFollow && !isFollower ? "#3897f1" : "grey",
            paddingVertical: 10,
            borderRadius: 5,
            alignItems: "center",
            marginHorizontal: 20,
            marginBottom: 20,
          }}
          onPress={() => (!isFollow && !isFollower ? handleFollow() : false)}
        >
          <Text style={styles.followButtonText}>{!isFollow && !isFollower ? "Follow" : "Followed"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>Posts :</Text>
      {dataUser?.getUserById?.posts && dataUser?.getUserById?.posts.length > 0 ? (
        <View style={styles.postContainer}>
          <FlatList
            data={dataUser?.getUserById?.posts}
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
    backgroundColor: "white",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
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
  postContainer: {
    flex: 1,
    margin: 2,
  },
  postImage: {
    flex: 1,
    aspectRatio: 1,
    margin: 1,
  },
  text: {
    marginHorizontal: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  followButtonText: {
    color: "white",
    fontWeight: "bold",
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
