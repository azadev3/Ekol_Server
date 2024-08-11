const mongoose = require('mongoose');

const AppealsSchema = mongoose.Schema({
     name_surname: { type: String, required: true },
     email: { type: String, required: true },
     telephone: { type: String, required: true },
     record: { type: String, required: true },
     prefix: { type: String, }
});

const AppealsModel = mongoose.model("appeal", AppealsSchema);

module.exports = AppealsModel;