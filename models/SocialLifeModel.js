const mongoose = require("mongoose");

const SocialLifeSchema = mongoose.Schema({
  description: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
});

const SocialLifeModel = mongoose.model("sociallifemodel", SocialLifeSchema);

module.exports = SocialLifeModel;
