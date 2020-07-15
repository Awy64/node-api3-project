const express = require('express');
const server = express();
const UserRouter = require('./users/userRouter.js')
const PostRouter = require("./posts/postRouter")

server.use(logger)
server.use(express.json())

server.use('/api/users', UserRouter)
server.use('/api/posts', PostRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  let d = new Date().toString()
  console.log(`${req.method}, ${req.originalUrl}, at ${d}`)
  next();
}

module.exports = server;
