const express = require('express');
const multer = require('multer');
const router = express.Router();
const Post = require('../Models/posts');


const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null
    }
    cb(error, "Backend/images")
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.get("", (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.then((documents) => {
    fetchedPosts = documents
    return Post.count();
  }).then(count => {
    res.status(200).json({
      message: "Post sent successfully",
      posts: fetchedPosts,
      postsCount: count
    });
  })
});

router.post("", multer({ storage: storage }).single('image'), (req, res) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });
  post.save()
    .then((createdPost) => {
      res.status(201).json({
        message: "post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    });
});

router.delete('/:id', (req, res) => {
  Post.deleteOne({ _id: req.params.id })
    .then((response) => {
      res.status(200).json({
        message: "Deleted post"
      })
    })
});

router.put('/:id', multer({ storage: storage }).single('image'), (req, res) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({ _id: req.params.id }, post)
    .then((response) => {
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
        res.status(404).json({ message: "Post not found" })
      }
    })
});


module.exports = router;
