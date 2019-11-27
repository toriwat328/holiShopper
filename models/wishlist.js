const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  recipient: { type: String, required: true },
  recipientCategory: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  storeName: { type: String, required: true },
  storeUrl: { type: String, required: true },
  priority: { type: String, required: true },
  notes: String,
  complete: { type: Boolean, default: false }

});

// create a collection
const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
