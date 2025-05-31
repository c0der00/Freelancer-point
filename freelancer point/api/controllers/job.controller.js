import { Job } from "../models/job.model.js";
import createError from "../utils/createError.js";

export const createJob = async (req, res) => {
    
  if(req.user.isSeller){
    return next(createError(404,"seller not create bid"))
  }

  console.log(req.body);
  


  const { title, description, skillsRequired, requirements , budget, deadline } = req.body;
  console.log(requirements);
  
  if (!title || !description || !skillsRequired || !budget || !budget || !deadline) {
    return res.status(400).send(createError(400,'Please fill all required fields'));
  }

  try {
    const job = await Job.create({
      userId: req.user._id,
      title,
      description,
      requirements : requirements,
      skillsRequired,
      budget,
      deadline 
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).send(createError("somthing wont wrong"))
  }
};

export const getJobs = async (req, res) => {
  const id = req.user._id
  console.log(id);
  
    const jobs = await Job.find({userId:id}).sort({ createdAt: -1 });
    res.status(200).send(jobs);
  };

  export const getAllJob = async (req, res) => {
    const q = req.query;
    const page = parseInt(q.page) || 1;
    const limit = parseInt(q.limit) || 10;
    const skip = (page - 1) * limit;  
    try {
      const jobs = await Job.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const totalJobs = await Job.countDocuments();

      res.status(200).json({
        jobs,
        totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
        currentPage: page,
      });
    } catch (err) {
      res.status(500).send({ message: "Server Error" });
    }
  };

  
  
export const getJobById = async (req, res,next) => {
    const jobId = req.params.id;
    if(!jobId){
        return next(createError(404,"requierd id"))
    }
    const job = await Job.findById(req.params.id);
    if (!job) {
        return next(404,"job not found")
    }
    return res.status(200).send(job)
};

export const deleteJobById = async(req,res,next) => {
    const jobId = req.params.id;
    if(!jobId){
        return next(createError(404,"requierd id"))
    }
    await Job.findByIdAndDelete(jobId);
    return res.status(200).send(createError(200,"job deleted"))
}

