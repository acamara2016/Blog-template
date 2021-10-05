const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Post = require('../models/post');
const Message = require('../models/message');
 
exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

// exports.getProfile = (req, res, next)=>{
//   Post.find({userId: req.session.user._id}).then( posts =>{
//     res.render('profile/profile', {
//       user: req.session.user,
//       posts: posts,
//       pageTitle: 'Account'
//     });
//   });
// };
exports.getProfile = (req, res, next)=>{
  User.find({_id:req.session.user._id}).then(user=>{
    Post.find({userId: req.session.user._id}).then( posts =>{
      res.render('profile/profile', {
        user: user[0],
        posts: posts,
        followers: user[0].followers.users,
        pageTitle: 'Account'
      });
    });
  });
};
exports.getUser = (req, res, next) =>{
  const {id} = req.params;
  const followCheck = req.user.followCheck(id);
  User.findById({_id:id}).then( user =>{
    Post.find({ userId: id }).then(posts =>{
      res.render('profile/other-profile',{
        user:user,
        posts: posts,
        follow: followCheck,
        pageTitle: user.username
      });
    });
  });
};
exports.postMessage = (req, res, next) =>{
  const email = req.body.email;
  const content = req.body.content;
  const message = new Message({
    messageContent: content,
    from: email
  });
  message.save();
  res.redirect('/');
};
exports.postFollow = (req, res, next)=>{
  const {userId} = req.body;
  req.user.follow(userId);
  res.redirect('user/'+userId);
};
exports.postUnFollow = (req, res, next)=>{
  const {userId} = req.body;
  req.user.unfollow(userId);
  res.redirect('user/'+userId);
};
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const fullname = req.body.fullname;
  const password = req.body.password;
  const username = req.body.username;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'E-Mail exists already, please pick a different one.');
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            fullname: fullname,
            username: username,
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
        //   return transport.sendMail({
        //     to: email,
        //     from: 'camara.visualstudio@protonmail.com',
        //     subject: 'Signup Successful',
        //     html: '<h1>You successfully signed up!</h1>'
        //   });
        })
        .catch(err=>{
          console.log(err);
        })
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};