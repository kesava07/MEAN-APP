const express = require('express');
const multer = require('multer');
const router = express.Router();
const Post = require('../Models/posts');
const checkAuth = require('../middleware/check-auth');


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
  }).catch(() => {
    res.status(500).json({
      message: "Fetching posts failed.!"
    });
  });
});

router.post("", checkAuth, multer({ storage: storage }).single('image'), (req, res) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
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
    }).catch(() => {
      res.status(500).json({
        message: "Creating post failed.!"
      })
    });
});

router.delete('/:id', checkAuth, (req, res) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((response) => {
      if (response.n > 0) {
        res.status(200).json({
          message: "Deleted post"
        })
      } else {
        res.status(401).json({
          message: "Not authorized"
        })
      }
    }).catch(() => {
      res.status(500).json({
        message: "Couldn't delete post.!"
      })
    })
});

router.put('/:id', checkAuth, multer({ storage: storage }).single('image'), (req, res) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((response) => {
      if (response.nModified > 0) {
        res.status(200).json({
          message: "Updated successfully"
        })
      } else {
        res.status(401).json({
          message: "Not authorized"
        })
      }
    }).catch(() => {
      res.status(500).json({
        message: "Couldn't update post.!"
      })
    });
});

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({ message: "Post not found" })
      }
    }).catch(() => {
      res.status(500).json({
        message: "Fetching posts failed.!"
      })
    })
});


module.exports = router;
