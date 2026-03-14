
const mongoose=require("mongoose")

const userSchema = new mongoose.Schema({
  name: String,
  email: {
  type: String,
  required: true,
  unique: true,
},
 password: {
  type: String,
  required: true,
},
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
  },
  image:{
        type:String,
        required:true,
    },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("User", userSchema);