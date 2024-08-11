const mongoose = require("mongoose");

const SocialLifeCarouselSchema = mongoose.Schema({
  title: {
    az: String,
    en: String,
    ru: String,
  },
  image: {
    type: String,
    required: true,
  },
});

const SocialLifeCarouselModel = mongoose.model("sociallifecarouselmodel", SocialLifeCarouselSchema);

module.exports = SocialLifeCarouselModel;
