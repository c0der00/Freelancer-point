import { isValidObjectId, set } from "mongoose";
import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from 'bcrypt'
import Gig from "../models/gig.model.js";
import { Job } from "../models/job.model.js";

export const deleteUser = async (req, res, next) => {
  console.log("deleted");
  const {id}= req.params
  console.log(id);
  
  const user = await User.findById(req.params.id);

  if(!user){
    return next(createError(404, "User not found"))
  }

  if(!id){
    return next(createError(404, "User ID not found"))
  }

  if (id !== user._id.toString()) {
    return next(createError(403, "You can delete your account!"));
  }
  const response = await User.findByIdAndDelete(req.params.id);
  res.status(200).send(response);
};

export const getUser = async (req, res, next) => {
  console.log(req.params.id);
  
  const user = await User.findById(req.params.id);
  if(!isValidObjectId(user._id)){
    console.log("user id not found",user);
  }

  res.status(200).send(user);
};

export const getUsers = async(req,res) => {
  console.log('in ss');
  
  const users = await User.find()
  if(!users) {
    res.status(400).send("users are empty")
  }
  res.status(200).send(users)
}

export const updatePassword = async(req,res) => {
  const {userId} = req.params
  console.log(userId,"sfsed");
  
  const {newPassword} = req.body
  console.log(req.body)
  if(!userId){
    res.status(400).send("userId is required")
  }

  if(!isValidObjectId(userId)){
    res.status(400).send("user id not valide")
  }

  const user = await User.findById(userId)

  if(!user){
    res.status(400).send("user not found")
  }

  const hash = await bcrypt.hashSync(newPassword,5)

  const updatePassword = await User.findByIdAndUpdate(
    userId,
    {
      $set : {
        password : hash
      }
    },
    {
      new : true
    }
  )

  return res.status(200).send(updatePassword)
}

export const countUser = async(req,res) => {
  console.log("in ");
  
  try {
    const totalUser = await User.countDocuments()
    res.status(200).json(totalUser)
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message)
  }
}

export const countGigs = async(req,res) => {
  const totalGigs = await Gig.countDocuments()
  res.status(200).json(totalGigs)
}

export const getGigs = async(req,res) => {  
  const users = await Gig.find()
  if(!users) {
    res.status(400).send("gigs are empty")
  }
  res.status(200).send(users)
}

export const deleteGig = async (req, res, next) => {
  try {
    const {id} = req.params
    const gig = await Gig.findById(id);
    if (gig.userId !== req.userId)
      return next(createError(403, "You can delete only your gig!"));
    await Gig.findByIdAndDelete(id);
    res.status(200).send("Gig has been deleted!");
  } catch (err) {
    next(err);
  }
};

export const countJob = async(req,res,next) => {
  const jobs = await Job.countDocuments()
  res.status(200).json(jobs)
}

export const getJobs = async(req,res,next) => {
  try {
    const jobs = await Job.find()
    if(!jobs) {
      res.status(400).send("jobs are empty")
    }
    return res.status(200).send(jobs)
  } catch (error) {
    next(error)
  }
}


export const getWeeklyActivity = async (req, res) => {
  try {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const activity = {
      Sun: { users: 0, jobs: 0 },
      Mon: { users: 0, jobs: 0 },
      Tue: { users: 0, jobs: 0 },
      Wed: { users: 0, jobs: 0 },
      Thu: { users: 0, jobs: 0 },
      Fri: { users: 0, jobs: 0 },
      Sat: { users: 0, jobs: 0 },
    };

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const users = await User.find({ createdAt: { $gte: lastWeek } });
    const jobs = await Job.find({ createdAt: { $gte: lastWeek } });

    users.forEach(user => {
      const day = days[new Date(user.createdAt).getDay()];
      activity[day].users++;
    });

    jobs.forEach(job => {
      const day = days[new Date(job.createdAt).getDay()];
      activity[day].jobs++;
    });

    const formatted = days.map(day => ({
      date: day,
      users: activity[day].users,
      jobs: activity[day].jobs
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error getting activity:', err);
    res.status(500).json({ error: 'Failed to get activity' });
  }
};

export const getFreelancerGigActivity = async (req, res) => {
  try {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const activity = {
      Sun: { freelancers: 0, gigs: 0 },
      Mon: { freelancers: 0, gigs: 0 },
      Tue: { freelancers: 0, gigs: 0 },
      Wed: { freelancers: 0, gigs: 0 },
      Thu: { freelancers: 0, gigs: 0 },
      Fri: { freelancers: 0, gigs: 0 },
      Sat: { freelancers: 0, gigs: 0 },
    };

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const freelancers = await User.find({
      role: 'freelancer',
      createdAt: { $gte: lastWeek }
    });

    const gigs = await Gig.find({ createdAt: { $gte: lastWeek } });

    freelancers.forEach(user => {
      const day = days[new Date(user.createdAt).getDay()];
      activity[day].freelancers++;
    });

    gigs.forEach(gig => {
      const day = days[new Date(gig.createdAt).getDay()];
      activity[day].gigs++;
    });

    const formatted = days.map(day => ({
      date: day,
      freelancers: activity[day].freelancers,
      gigs: activity[day].gigs
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error getting freelancer/gig activity:', err);
    res.status(500).json({ error: 'Failed to get freelancer activity' });
  }
};