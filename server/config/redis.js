const Redis = require("ioredis");

const redis = new Redis({
  port: process.env.PORT_REDIS,
  host: process.env.HOST_REDIS,
  username: process.env.USERNAME_REDIS,
  password: process.env.PASSWORD_REDIS,
});

module.exports = redis;
