const express = require('express');
const router = express.Router();
const User = require('./userDb')
const Post = require('../posts/postDb')

router.post('/', validateUser, async (req, res) => {
  try {
    const newUser = await User.insert(req.body)
    res.status(201).json(newUser)
    
  } catch(error){
    console.log(error);
    res.status(500).json({error: "Unable to add user"});
  }
});

router.post('/:id/posts', validateUserId, validatePost, userIdMatchesParams, async (req, res) => {
  try {
    const data = req.body
    await Post.insert(data)
    res.status(201).json({message: "added new post", data})
  } catch(error){
    console.log(error);
    res.status(500).json({error: "Unable to create post"});
  }
});

router.get('/', async (req, res) => {
  try {
    const allUsers = await User.get();
    res.status(200).json(allUsers);
  } catch(error){
    console.log(error);
    res.status(500).json({error: "Unable to retrieve a list of users"});
  }
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  try {
    const userPosts = await User.getUserPosts(req.user.id)
    res.status(200).json(userPosts)
  } catch(error){
    console.log(error)
    res.status(500).json({error: "Unable to retrieve the specified user post."})
  }
});

router.delete('/:id',validateUserId, async (req, res) => {
  try {
    const deleted = await User.remove(req.user.id)
    res.status(202).json(deleted)
  } catch(error){
    console.log(error)
    res.status(500).json({error: "Unable to remove user."})
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
  try {
    await User.update(req.params.id, req.body)
    res.status(201).json({message: "user updated"})
  } catch(error){
    console.log(error)
    res.status(500).json({error: "Unable to update user."})
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  const {id} = req.params;
  try {
    const validUser = await User.getById(id);
    console.log("valid User", validUser)
      if (validUser === undefined) {
        res.status(404).json({error: "The specified user ID does not exist"})
      }else{
        req.user = validUser
        next();
      }
    
  } catch(error){
    console.log(error);
    res
      .status(500)
      .json({error: "Unable to retrieve the specified user ID."})

  }
}

function validateUser(req, res, next) {
  const userInfo = req.body;
  if (Object.entries(userInfo) === 0) {
    res.status(400).json({message: "missing required text field"})
  }else if (!userInfo.name) {
    res.status(400).json({message: "missing post data"})
  }else{
    next();
  }
}

function validatePost(req, res, next) {
  const post = req.body;
  if (Object.entries(post) === 0) {
    res.status(400).json({message: "missing required text field"})
  }else if (!post.text) {
    res.status(400).json({message: "missing text "})
  }else if(!post.user_id){
    res.status(400).json({message: "missing user ID "})
  }else{
    next();
  }
}

function userIdMatchesParams(req, res, next){
  if (req.params.id == req.body.user_id){
    next()
  }else{
    res.status(400).json({message: "user id does not match"})
  }
}

module.exports = router;
