if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const PORT = process.env.PORT || 3000;
const { connect, getDB } = require("./config/mongo-config");
const { userTypeDefs, userResolvers } = require("./schemas/user");
const { readPayload } = require("./utils/jwt");
const { postTypeDefs, postResolvers } = require("./schemas/posts");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs],
  resolvers: [userResolvers, postResolvers],
  introspection: true,
});

(async () => {
  await connect();
  const db = await getDB();

  const { url } = await startStandaloneServer(server, {
    listen: PORT,
    context: async ({ req, res }) => {
      return {
        doAuthentication: async () => {
          const headerAuthorization = req.headers.authorization;
          if (!headerAuthorization) {
            throw new GraphQLError("You are not authenticated", {
              extensions: {
                http: "401",
                code: "UNAUTHENTICATED",
              },
            });
          }

          const token = headerAuthorization.split(" ")[1];

          const payload = readPayload(token);
          const user = await db
            .collection("User")
            .findOne({ username: payload.username });

          if (!user) {
            throw new GraphQLError("You are not authenticated", {
              extensions: {
                http: "401",
                code: "UNAUTHENTICATED",
              },
            });
          }
          return {
            id: user._id,
            username: user.username,
          };
        },
        db,
      };
    },
  });

  console.log(`Server on ${url}`);
})();
