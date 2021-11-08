const Post = require('../models/post');
const mongoose = require('mongoose');
const User = require('../models/user');
exports.getIndex = (req, res, next) => {
  if(!req.session.user){
    User.find().then(users=>{
      Post.find()
      .populate('userId', 'username')
      .then(posts => {
        res.render('mundana/pages/index',{
          posts: posts,
          hero_post: posts[Math.floor(Math.random() * posts.length)],
          pageTitle: 'Posts',
          suggestions: users
        });
      });
    });
  }else{
    Post.find()
    .populate('userId', 'username')
    .then(posts => {
      res.render('mundana/pages/index',{
        username: req.session.user.username,
        posts: posts,
        hero_post: posts[Math.floor(Math.random() * posts.length)],
        pageTitle: 'Posts',
        suggestions: parsedUser
      });
    });
  }

};
exports.getPostEdit = (req, res, next) => {
  const id = req.params.id;
  Post.findById({_id: new mongoose.Types.ObjectId(id)})
  .then(post => {
    res.render('posts/editPost',{
      post: post,
      pageTitle: post.title
    });
  });
};
exports.getAbout = (req, res, next)=>{
  res.render('mundana/pages/about',{
    path: '/about',
    pageTitle: 'About'
  })
}
exports.getDocumentation = (req, res, next) =>{
  res.render('mundana/pages/doc',{
    pageTitle: 'Documentation',
    path: '/doc'
  })
}
exports.getWritePost = (req, res, next)=>{
  res.render('mundana/pages/newpost',{
    pageTitle: 'Write post',
    path: 'write-post'
  })
}
exports.getCategories = (req, res, next)=>{
  const category = req.params.category
  Post.find({tags:category})
  .populate('userId', 'username')
  .then(posts=>{
    console.log(posts);
    res.render('mundana/pages/category',{
      path: '/categories',
      posts: posts,
      heroPost: posts[0],
      pageTitle: category
    })
  })
   
}
exports.getPostById = (req, res, next) => {
  const id = req.params.id.toString();
  Post.findOne({_id: new mongoose.Types.ObjectId(id)})
    .populate('userId', 'username')
    .then(post => {
      Post.find({userId: post.userId}).then(userPost=>{
        console.log(userPost)
        res.render('mundana/pages/article',{
          post: post,
          userPost: userPost,
          heroPost: userPost[0],
          comments: post.comments,
          likes: post.like,
          pageTitle: post.title
        });
      })
    });
};

exports.postComment = (req, res, next)=>{
  const id = req.body.id;
  Post.findById({_id: new mongoose.Types.ObjectId(id)}).then(post => {
    post.addcomment(req.session.user._id, req.body.comment);
  });
  res.redirect('post/'+id);
};

exports.postLike = (req, res, next)=>{
  const id = req.body.id;
  Post.findById({_id: new mongoose.Types.ObjectId(id)}).then(post => {
    post.addLike(req.session.user._id.toString());
  });
  res.redirect('post/'+id);
};

exports.getAddPost = (req, res, next) => {
  res.render('posts/newPost',{
    pageTitle: 'New Post'
  });
};


exports.postPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const subtitle = req.body.subtitle;
  const tags = req.body.tags;
  const parsedTags = tags.split(';');
  const imageUrl = req.body.imageUrl;
  const newPost = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    subtitle: subtitle,
    createdAt: new Date(),
    tags: parsedTags,
    userId: req.session.user._id,
  });
  newPost.save();
  res.redirect('/');
};