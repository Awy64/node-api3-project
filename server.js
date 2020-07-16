const express = require('express');
const server = express();
const UserRouter = require('./users/userRouter.js')
const PostRouter = require("./posts/postRouter")

server.use(logger)
server.use(express.json())

server.use('/api/users', UserRouter)
server.use('/api/posts', PostRouter)

server.get('/', (req, res) => {
  const messageOfTheDay = process.env.MOTD || "hello world"
  res.status(200).json({api: "up", Message: messageOfTheDay});
});

//custom middleware

function logger(req, res, next) {
  let d = new Date().toString()
  console.log(`${req.method}, ${req.originalUrl}, at ${d}`)
  next();
}

module.exports = server;
