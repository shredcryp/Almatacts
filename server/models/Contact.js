const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    linkusername: {type: String, required: true},
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    tags: { type: [String], required: true },  // Array of tags (home, work, etc.)
    imageURL: {type: String, default: "uploads/default.jpg"}

    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }  // Link contact to the user
});

const ContactModel = mongoose.model("Contact", contactSchema);

module.exports = ContactModel;
