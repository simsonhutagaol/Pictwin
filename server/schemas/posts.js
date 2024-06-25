const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");
const redis = require("../config/redis");

const postTypeDefs = `#graphql
  type UserPost {
    _id: ID!
    name: String
    email: String!
    username: String!
    imgUrl:String
  }
  
  type Comments{
    content:String!
    username:String!
    createdAt:String
    updatedAt:String
  }

  type Likes{
    username:String!
    createdAt:String
    updatedAt:String
  }

  type Post{
    _id:ID!
    content:String!
    tags:[String]
    imgUrl:String!
    authorId:ID!
    comments:[Comments]
    likes:[Likes]
    createdAt:String
    updatedAt:String
    authorName:UserPost
  }

  input PostInput{
    content:String!
    tags:[String]
    imgUrl:String!
  }

  type Message{
    message:String!
  }

  type Query{
    getPosts:[Post]
    getPostById(_id:ID!):Post
  }

  input CommentInput{
    content:String!
    _id:ID!
  }

  type Mutation{
    commentPost(input:CommentInput!):Message
    likePost(_id:ID!):Message
    addPost(input:PostInput):Message
  }
`;

const postResolvers = {
  Query: {
    //berdasarkan data terbaru
    getPosts: async (_, _args, contextValue) => {
      await contextValue.doAuthentication();
      const { db } = contextValue;
      const booksCache = await redis.get("posts");

      if (booksCache) {
        return JSON.parse(booksCache);
      }

      const result = await db
        .collection("Posts")
        .aggregate([
          {
            $lookup: {
              from: "User",
              localField: "authorId",
              foreignField: "_id",
              as: "authorName",
            },
          },
          {
            $unwind: {
              path: "$authorName",
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .sort({ createdAt: -1 })
        .toArray();

      await redis.set("posts", JSON.stringify(result));

      return result;
    },
    //berdasarkan id
    getPostById: async (_, args, contextValue) => {
      await contextValue.doAuthentication();
      const { db } = contextValue;
      const { _id } = args;
      const result = await db
        .collection("Posts")
        .aggregate([
          { $match: { _id: new ObjectId(_id) } },
          {
            $lookup: {
              from: "User",
              localField: "authorId",
              foreignField: "_id",
              as: "authorName",
            },
          },
          {
            $unwind: {
              path: "$authorName",
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .next();

      return result;
    },
  },

  Mutation: {
    addPost: async (_, args, contextValue) => {
      const { id } = await contextValue.doAuthentication();
      const { input } = args;
      const { db } = contextValue;
      const { content, tags, imgUrl } = input;

      if (!content) {
        throw new GraphQLError("Content can't be empty");
      }
      if (!imgUrl) {
        throw new GraphQLError("Image can't be empty");
      }
      const post = await db.collection("Posts").insertOne({
        content,
        tags,
        imgUrl,
        authorId: id,
        comments: [],
        likes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await redis.del("posts");

      return {
        message: "Success",
      };
    },

    commentPost: async (_, args, contextValue) => {
      const { input } = args;
      const { content, _id } = input;
      const { username } = await contextValue.doAuthentication();
      const { db } = contextValue;
      const comment = {
        content,
        username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = await db
        .collection("Posts")
        .updateOne(
          { _id: new ObjectId(_id) },
          { $push: { comments: comment } }
        );
      await redis.del("posts");
      return {
        message: `Success comment`,
      };
    },

    likePost: async (_, args, contextValue) => {
      const { _id } = args;
      const { username } = await contextValue.doAuthentication();
      const { db } = contextValue;

      const like = {
        username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const post = await db
        .collection("Posts")
        .findOne({ _id: new ObjectId(_id) });

      if (!post) {
        throw new GraphQLError("Not found");
      }

      const likedBefore = post.likes.some((like) => like.username == username);

      if (likedBefore) {
        throw new GraphQLError("You have liked this post before.");
      }

      const result = await db
        .collection("Posts")
        .updateOne({ _id: new ObjectId(_id) }, { $push: { likes: like } });
      await redis.del("posts");
      return {
        message: `Success like`,
      };
    },
  },
};

module.exports = {
  postResolvers,
  postTypeDefs,
};
