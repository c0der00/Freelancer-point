import { log } from "console";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/clodinary.utils.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const register = async (req, res, next) => {
  try {
    const { username, password, ...restOfBody } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required.");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username is already taken.");
    }

    const hash = bcrypt.hashSync(password, 5);

    console.log(req.files);
    

    const imagePath = req.files?.img[0]?.path

    console.log(imagePath);
    

    if(!imagePath){
      return res.status(400).send("Please upload path is required.")
    }

    const img = await uploadOnCloudinary(imagePath)
    
    if(!img){
      return res.status(400).send("Please upload an image")
    }
    
    const newUser = new User({
      username, 
      password: hash,
      img : img.url,
      ...restOfBody
    });

    await newUser.save();
    res.status(201).send("User has been created.");
  } catch (err) {
    next(err); 
  }
};


export const login = async (req, res, next) => {
  try {



    const user = await User.findOne({ username: req.body.username });    

    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    );


    const { password, ...info } = user._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};

export const becomeDev = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    const user = await User.findOne({ username });

    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(password, user.password);
    if (!isCorrect) return next(createError(401, "Wrong password or username!"));

    if (user.isSeller) {
      return res.status(400).send("User is already a seller.");
    }

    user.isSeller = true;
    await user.save();

    res.status(200).send("You are now a seller!");
  } catch (err) {
    next(err);
  }
};