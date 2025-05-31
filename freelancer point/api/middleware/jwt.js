import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) return next(createError(401, "You are not authenticated!"));
  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) return next(createError(403, "Token is not valid!"));

    try {
      const user = await User.findById(payload.id);
      if (!user) return next(createError(404, "User not found"));

      req.user = user;
      req.userId = payload.id;
      req.isSeller = payload.isSeller;

      next();
    } catch (dbError) {
      next(createError(500, "Failed to fetch user"));
    }
  });
};



// export const verifyToken = async(req,res,next) => {
//    try {
    
    
//     const token =  req.cookies?.accessToken || req.header
//      ("Authorization")?.replace("Bearer","")
    
//      if (!token) return next(createError(401,"You are not authenticated!"))
 
//      const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
//      console.log(decodeToken);
     
//      const user = await User.findById(decodeToken?.id)
//      console.log(user);
     
//      if(!user){
//          return next(createError(401,"Invalid access Token"))
//      }
 
//      req.user = user;
     
//      next()
//    } catch (error) {
//     throw new ApiError(401,error?.message || "Invalid access Token")
//    }
// }