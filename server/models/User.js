const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    leetcode:  String,
    github:    String,
    codechef:  String,
    cgpa:      Number,
    branch:    String,
    gradYear:  String,
    skills:    [String],
    role:      String,
    companies: [String],
  },
  lastAnalysis: { type: Object, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);