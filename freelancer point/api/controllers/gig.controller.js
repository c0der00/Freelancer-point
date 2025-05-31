import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";
import { uploadOnCloudinary } from "../utils/clodinary.utils.js";
import { isValidObjectId } from "mongoose";

export const createGig = async (req, res, next) => {
  console.log(req.user,"llllllllllllllllllllllllllllllllllllllllllllllllllllllll");
  
  if (!req.user.isSeller)
    return next(createError(403, "Only sellers can create a gig!"));

  try {
    console.log(req.files);

    if (!req.files || !req.files.cover || req.files.cover.length === 0) {
      return next(createError(400, "Please upload a cover image"));
    }

    if (!req.files.images || req.files.images.length === 0) {
      return next(createError(400, "Please upload at least one image"));
    }

    const coverPath = req.files.cover[0].path;
    const imagesPaths = req.files.images.map((file) => file.path);

    const cover = await uploadOnCloudinary(coverPath);
    if (!cover) {
      return next(createError(400, "Failed to upload cover image"));
    }

    const images = await Promise.all(
      imagesPaths.map((imagePath) => uploadOnCloudinary(imagePath))
    );
    if (!images.every((img) => img)) {
      return next(createError(400, "Failed to upload some images"));
    }

    const newGig = new Gig({
      userId: req.userId,
      cover: cover.url, 
      images: images.map((img) => img.url),
      ...req.body
    });

    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    console.error(err); 
    next(createError(500, "Internal server error")); 
  }
};



export const getGig = async (req, res, next) => {
  try {
    console.log(req.params);
    
    const {gigId} = req.params

    const gig = await Gig.findById(gigId);

    console.log(gig);
   
    console.log("sdv sdjv");
    
    
    if (!gig) next(createError(404, "Gig not found!"));
    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};
export const getGigs = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  const page = parseInt(q.page) || 1;  
  const limit = parseInt(q.limit) || 10; 
  const skip = (page - 1) * limit;

  try {
    const gigs = await Gig.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ [q.sort]: -1 });

    const totalGigs = await Gig.countDocuments(filters);

    res.status(200).json({
      gigs,
      totalGigs,
      totalPages: Math.ceil(totalGigs / limit),  
      currentPage: page, 
    });
  } catch (err) {
    next(err);
  }
};

export const myGigs = async(req,res,next) => {
  const {id} = req.params
  if(!id){
    return next(createError(400,"id is required"))
  }

  if(!isValidObjectId(id)){
    return next(createError(400,"id is invalid"))
  }

  try {
    const fatch = await Gig.find(
      {userId : id}
    )
  
    res.status(200).send(fatch)
  } catch (error) {
    next(error)
  }
}

export const deleteGig = async(req,res,next) => {
  const {id} = req.params
  if(!id){
    return next(400,"id required")
  }
  if(!isValidObjectId(id)){
    return next(400,"id is invalid")
  }
  try {
    await Gig.findByIdAndDelete(id)
    res.status(200).send("gig deleted")
  } catch (error) {
    next(createError(500,error))
  }
}

