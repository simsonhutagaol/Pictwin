import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList, 
  Image, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Button, 
  ScrollView 
} from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { COMMENT_INPUT, GET_POST } from '../queries';

export default function DetailPost({ route }) {
  const { postId } = route.params;
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [dispatcher, { loading }] = useMutation(COMMENT_INPUT, {
    onCompleted: async () => {
      if (commentInput.trim() !== '') {
        await setCommentInput('');
        setModalVisible(false); 
      }
    }
  });
  

  const { data, refetch } = useQuery(GET_POST, {
    variables: { id: postId }
  });

  useEffect(() => {
    if (data?.getPostById?.comments) {
      setComments(data?.getPostById?.comments);
    }
  }, [data?.getPostById?.comments]);

  const handleAddComment = async () => {
    await dispatcher({
      variables: {
        input: {
          _id: postId,
          content: commentInput
        }
      }
    });
    refetch();
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tagsLabel}>Tags: {data?.getPostById?.tags ? "#" + data?.getPostById?.tags.join(' #') : "empty"}</Text>
        <Text style={styles.likesLabel}>Likes: {data?.getPostById?.likes.length} Person</Text>
      </View>
      <Image
        style={styles.postImage}
        source={{ uri: data?.getPostById?.imgUrl }}
      />
      <View style={styles.postInfo}>
        <Text style={styles.commentsLabel}>Content:</Text>
        <ScrollView style={styles.content}>
          <Text style={styles.tagsText}>
            {data?.getPostById?.content}
          </Text>
        </ScrollView>
        <Text style={styles.commentsLabel}>Comments:</Text>
        <FlatList
          data={comments}
          keyExtractor={(item) => item?.createdAt.toString()}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <Text style={styles.username}>{item?.username} :</Text>
              <Text style={styles.content}>{item?.content}</Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.commentButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.commentButtonText}>Add Comment</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment"
                value={commentInput}
                onChangeText={setCommentInput}
                multiline={true}
              />
              <Button title="Post" onPress={handleAddComment} />
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white"
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  postInfo: {
    flex: 1,
  },
  content: {
    marginBottom: 10,
    maxHeight: 200,
  },
  tagsLabel: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  likesLabel: {
    fontWeight: 'bold',
  },
  commentsLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  comment: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  commentButton: {
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#0095f6',
    borderRadius: 5,
    alignItems: 'center',
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    minHeight: 100,
    maxHeight: 100
  },
});
