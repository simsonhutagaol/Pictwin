const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

const userTypeDefs = `#graphql
  type Follower{
    _id:ID
    name:String
    username:String,
  }
  type Following{
    _id:ID
    name:String
    username:String
  }
  type PostUser{
    _id:ID!
    imgUrl:String!
    authorId:ID!
  }

  type User {
    _id: ID!
    name: String
    email: String!
    username: String!
    imgUrl:String
    follower:[Follower]
    following:[Following]
    posts:[PostUser]
  }

  type UserByName {
    _id: ID!
    name: String
    email: String!
    username: String!
    imgUrl:String
  }
  
  type Message{
	  message:String!
  }

  type Token{
	  token:String!
  }

  input RegisterInput{
    name:String
    username:String!
  	email:String!
  	password:String!
    imgUrl:String
  }

  input UserLogin{
    username:String!
    password:String!
  }

  type Query{
	  getUserByUserName(search:String!):[UserByName]
	  getUserById(_id:ID):User
  }
  
  type Mutation {
	  login(input:UserLogin):Token
    register(input:RegisterInput): Message
	  follow(_id:ID!):Message
  }
`;

const userResolvers = {
  Query: {
    //menampilkan user berdasarkan username (search)
    getUserByUserName: async (_, args, contextValue) => {
      await contextValue.doAuthentication();
      const { search } = args;
      const { db } = contextValue;
      const regex = new RegExp(search, "i");
      const result = await db
        .collection("User")
        .find(
          {
            username: { $regex: regex },
          },
          {
            projection: {
              password: 0,
            },
          }
        )
        .toArray();
      return result;
    },
    //menampilkan profile user
    getUserById: async (_, args, contextValue) => {
      let inputId;
      const { id: idProfile } = await contextValue.doAuthentication();
      const { _id } = args;

      if (_id) {
        inputId = _id;
      } else {
        inputId = idProfile;
      }
      const { db } = contextValue;
      const user = await db
        .collection("User")
        .aggregate([
          { $match: { _id: new ObjectId(inputId) } },
          {
            $lookup: {
              from: "Posts",
              localField: "_id",
              foreignField: "authorId",
              as: "posts",
            },
          },
          {
            $lookup: {
              from: "Follow",
              localField: "_id",
              foreignField: "followerId",
              as: "follower",
            },
          },
          {
            $lookup: {
              from: "Follow",
              localField: "_id",
              foreignField: "followingId",
              as: "following",
            },
          },
          {
            $lookup: {
              from: "User",
              localField: "follower.followingId",
              foreignField: "_id",
              as: "follower",
            },
          },
          {
            $lookup: {
              from: "User",
              localField: "following.followerId",
              foreignField: "_id",
              as: "following",
            },
          },
        ])
        .next();
      // console.log(user);

      if (!user) {
        throw new GraphQLError("Not found");
      }
      return user;
    },
  },

  Mutation: {
    //add user
    register: async (_, args, contextValue) => {
      const { input } = args;
      const { name, username, email, password, imgUrl } = input;
      const { db } = contextValue;
      if (!username) {
        throw new GraphQLError("Username required");
      }
      const existingUsername = await db
        .collection("User")
        .findOne({ username });

      if (existingUsername) {
        throw new GraphQLError(
          "Username is already registered, please use another username."
        );
      }

      if (!email) {
        throw new GraphQLError("Email required");
      }

      const formatEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formatEmail.test(email)) {
        throw new GraphQLError("Invalid email format");
      }

      const existingEmail = await db.collection("User").findOne({ email });
      if (existingEmail) {
        throw new GraphQLError(
          "Email is already registered, please use another email."
        );
      }

      if (!password) {
        throw new GraphQLError("Password required");
      }

      if (password.length < 5) {
        throw new GraphQLError("The minimum password length is 5 characters.");
      }

      await db.collection("User").insertOne({
        name,
        username,
        email,
        password: bcrypt.hashSync(password, 10),
        imgUrl,
      });

      return { message: "Success" };
    },

    //login
    login: async (_, args, contextValue) => {
      const { input } = args;
      const { username, password } = input;
      if (!username) {
        throw new GraphQLError("Username Required");
      }
      if (!password) {
        throw new GraphQLError("Password Required");
      }

      const { db } = contextValue;
      const user = await db.collection("User").findOne({ username });
      if (!user) {
        throw new GraphQLError("Invalid username or password");
      }
      const compare = bcrypt.compareSync(password, user.password);
      if (!compare) {
        throw new GraphQLError("Invalid username or password");
      }
      const payload = {
        id: user._id,
        username: user.username,
      };
      const token = generateToken(payload);

      return {
        token: token,
      };
    },
    //follow user
    follow: async (_, args, contextValue) => {
      const { _id } = args;
      const { db } = contextValue;
      const { id: followingId } = await contextValue.doAuthentication();
      if (_id == followingId) {
        throw new GraphQLError("cant follow");
      }
      const existingFollow = await db.collection("Follow").findOne({
        followingId: new ObjectId(_id),
        followerId: followingId,
      });

      if (existingFollow) {
        throw new GraphQLError("You have followed this user before.");
      }

      const replaceFollow = await db.collection("Follow").findOne({
        followingId,
        followerId: new ObjectId(_id),
      });

      if (replaceFollow) {
        throw new GraphQLError("You have followed this user before.");
      }
      const follow = {
        followingId,
        followerId: new ObjectId(_id),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = await db.collection("Follow").insertOne(follow);

      return { message: "Success follow" };
    },
  },
};

module.exports = {
  userTypeDefs,
  userResolvers,
};
