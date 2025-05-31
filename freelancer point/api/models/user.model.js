import mongoose from "mongoose";
import bcryp from 'bcrypt'
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  isSeller: {
    type: Boolean,
    default:false
  },
  isAdmin : {
    type: Boolean,
    default:false
  },
  refreshToken : {
    type : String
  }
},{timestamps:true});

// userSchema.pre("save" , async (next) => {
//   console.log('vvvvv');
  
//   // if(!isModified("password")) return next();
//   this.password = await bcryp.hash(this.password, 5)
//   next()
// }) 

// userSchema.methods.isPasswordCorrect = async(password) => {
//   console.log(password);
  
//   return await bcryp.compare(password, this.password)
// }

userSchema.methods.generateAccessToken =   () => {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  );
};

userSchema.methods.generateRefreshToken =  () => {
return jwt.sign(
  {
  _id: this._id,
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
  expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  }
);
}

export default mongoose.model("User", userSchema)