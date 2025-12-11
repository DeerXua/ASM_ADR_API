const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  FullName: { type: String }
}, { timestamps: true }); // tạo createdAt, updatedAt

module.exports = mongoose.model("Account", AccountSchema);
