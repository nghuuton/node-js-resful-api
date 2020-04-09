const mongoose = require('mongoose');

const userScheme = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   email: {
      type: String,
      require: true,
      unique: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
   },
   password: {
      type: String,
      require: true
   }
});

module.exports = mongoose.model('User', userScheme);