const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/user');
const bodyParser = require('body-parser');
const app = express();
const authRoutes = require('./routes/auth.routes');
const postRoute = require('./routes/post.routes');
const MONGODB_URI = `mongodb+srv://acamara:-----------@-----.------.mongodb.net/----`;
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});
app.use(postRoute);
app.use(authRoutes);

app.use('*',errorController.get404);
mongoose.connect(MONGODB_URI)
  .then(result => {
    console.log('🚀 Connected');
    app.listen(process.env.PORT || 3000);
  }).catch(err => console.log(err));
