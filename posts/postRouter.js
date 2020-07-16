const express = require('express');
const router = express.Router();
const Post = require("./postDb")

router.get('/', async (req, res) => {
  try {
    const posts = await Post.get()
    res.status(200).json(posts)
  } catch(error) {
    console.log(error);
    res.status(500).json({message: "can not retreve posts at this time"})
  }
});

router.get('/:id', validatePostId, async (req, res) => {
  try{
    const posts = await Post.getById(req.params.id)
    res.status(200).json(posts)
  } catch(error) {
    console.log(error);
    res.status(500).json({message: "can not retreve posts at this time"})
  }
});

router.delete('/:id', validatePostId, async (req, res) => {
  try{
    await Post.remove(req.params.id)
    res.status(200).json({message: "post removed"})
  } catch(error) {
    console.log(error);
    res.status(500).json({message: "can not remove posts at this time"})
  }
});

router.put('/:id', validatePostId, validatePost, async (req, res) => {
  try{
    await Post.update(req.params.id, req.body)
    res.status(202).json({message: "Updated Post"})
  } catch(error) {
    console.log(error);
    res.status(500).json({message: "can not update posts at this time"})
  }
});

// custom middleware

async function validatePostId(req, res, next) {
  const {id} = req.params;
  try {
    const validPostId = await Post.getById(id);
      if (validPostId === undefined) {
        res.status(404).json({error: "The specified Post ID does not exist"})
      }else{
        req.post = validPostId
        next();
      }
    
  } catch(error){
    console.log(error);
    res
      .status(500)
      .json({error: "Unable to retrieve the specified user ID."})

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

module.exports = router;
