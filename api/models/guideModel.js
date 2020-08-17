const mongoose = require("mongoose");

const guideSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String},
  featured: { type: Boolean, required: true },
});

module.exports = mongoose.model("Guide", guideSchema);
