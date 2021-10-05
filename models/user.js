const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username:{
    type: String,
    required: true,
  },
  fullname:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  followers: {
    users: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: false
        }
      }
    ]
  }
});

userSchema.methods.follow = function(id) {
  const follows = [...this.followers.users];
  
  follows.push({
    userId: id
  });
  const updatedFollowers = {
    users: follows
  };
  this.followers = updatedFollowers;
  return this.save();
};
userSchema.methods.unfollow = function(id) {
  const follows = [...this.followers.users];
  const parsed = follows.filter(follow => follow.userId === id);
  const updatedFollowers = {
    users: parsed
  };
  this.followers = updatedFollowers;
  return this.save();
};

userSchema.methods.followCheck = function(id) {
  const follows = [...this.followers.users];
  const follower = follows.map(follow=> {
    if(follow.userId.toString() == id.toString()){
      return true;
    }else{
      return false;
    }
  });
  return follower[0];
};

module.exports = mongoose.model('User', userSchema);