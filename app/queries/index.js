import { gql } from "@apollo/client";

export const DO_LOGIN = gql`
  mutation Mutation($input: UserLogin) {
    login(input: $input) {
      token
    }
  }
`;

export const REGISTER = gql`
  mutation Mutation($input: RegisterInput) {
    register(input: $input) {
      message
    }
  }
`;

export const GET_POSTS = gql`
  query Query {
    getPosts {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      authorName {
        _id
        name
        email
        username
        imgUrl
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROFILE = gql`
  query Query($id: ID) {
    getUserById(_id: $id) {
      _id
      name
      email
      username
      imgUrl
      follower {
        _id
        name
        username
      }
      following {
        _id
        name
        username
      }
      posts {
        _id
        imgUrl
        authorId
      }
    }
  }
`;
export const GET_MY_PROFILE = gql`
  query Query {
    getUserById {
      _id
      name
      email
      username
      imgUrl
      follower {
        _id
        name
        username
      }
      following {
        _id
        name
        username
      }
      posts {
        _id
        imgUrl
        authorId
      }
    }
  }
`;

export const GET_POST = gql`
  query Query($id: ID!) {
    getPostById(_id: $id) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      authorName {
        _id
        name
        email
        username
        imgUrl
      }
    }
  }
`;

export const ADD_POST = gql`
  mutation Mutation($input: PostInput) {
    addPost(input: $input) {
      message
    }
  }
`;

export const FOLLOW = gql`
  mutation Mutation($id: ID!) {
    follow(_id: $id) {
      message
    }
  }
`;

export const SEARCH_USER = gql`
  query Query($search: String!) {
    getUserByUserName(search: $search) {
      _id
      name
      username
      imgUrl
    }
  }
`;

export const COMMENT_INPUT = gql`
  mutation Mutation($input: CommentInput!) {
    commentPost(input: $input) {
      message
    }
  }
`;

export const LIKES_POST = gql`
  mutation Mutation($id: ID!) {
    likePost(_id: $id) {
      message
    }
  }
`;
