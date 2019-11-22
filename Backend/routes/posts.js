const express = require('express');
const router = express.Router();
const Post = require('../Models/posts');

router.get("", (req, res) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Post sent successfully",
      posts: documents
    });
  });
});

router.post("", (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save()
    .then((createdPost) => {
      res.status(201).json({
        message: "post added successfully",
        postId: createdPost._id
      });
    });
});

router.delete('/:id', (req, res) => {
  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id})
    .then((response) => {
      console.log(response)
      res.status(200).json({
        message: "Deleted post"
      })
    })
});

router.put('/:id', (req, res) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post)
    .then((response) => {
      console.log(response)
      res.status(200).json({
        message: "Updated successfully"
      })
    })
});

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({message: "Post not found"})
      }
    })
});


module.exports = router;
