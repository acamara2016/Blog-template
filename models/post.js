const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  subtitle:{
    type: String,
    required: true
  },
  tags:{
    type: [],
    required: false
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments:[
      {
        commentContent: {
          type: String,
          required: true
        },
        commentDate:{
          type: Date,
          required: true,
        },
        commentBy:{
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        }
      }
  ],
  like:[
      {
        likedBy:{
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        likedDate:{
          type: Date,
          required: true
        }
      }
  ]
});

postSchema.methods.addcomment = function(id,comment) {
  const commentsList = [...this.comments];
  
  commentsList.push({
    commentContent: comment,
    commentDate: new Date(),
    commentBy : id
  });
  
  this.comments = commentsList;
  return this.save();
};

postSchema.methods.addLike = function(id) {
  const likeList = [...this.like];

  likeList.push({
    likedBy: id,
    likedDate: new Date()
  });

  this.like = likeList;
  return this.save();
};

module.exports = mongoose.model('Post', postSchema);