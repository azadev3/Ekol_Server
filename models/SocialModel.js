const mongoose = require('mongoose');

const SocialSchema = mongoose.Schema({
     icon: {
          type: String,
          required: true,
     },
     link: {
          type: String,
          required: true,
     },
});

const SocialModel = mongoose.model("socialmodel", SocialSchema);

module.exports = SocialModel;