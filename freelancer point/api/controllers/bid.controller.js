import { Bid } from '../models/bid.model.js';
import { Job } from '../models/job.model.js';
import User from '../models/user.model.js';
import createError from '../utils/createError.js';
import sendEmail from '../utils/email.js';


export const createBid = async (req, res) => {
  const { proposalText, proposedAmount, estimatedDays } = req.body;
  const jobId = req.params.jobId;

  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ msg: 'Job not found' });

  const bid = await Bid.create({
    jobId,
    freelancerId: req.user.id,
    proposalText,
    proposedAmount,
    estimatedDays
  });

  res.status(201).send(bid);
};

export const getBidsByJob = async (req, res,next) => {
  const {jobId} = req.params 
  console.log(jobId,"LLLLLLLLLLLLLLLLLLLLL");
  
  if(!jobId){
    return next(createError(400,"job id is required"))
  }
  const bids = await Bid.find(
    {jobId : jobId}
  )
    .sort({ createdAt: -1 });

  res.status(200).send(bids);
};

export const getBidsByFreelancer = async (req, res,next) => {
  const {freelancerId} = req.params
  console.log(freelancerId,"LLLLLLLLLLLLLLLLLLLLL");
  
  if(!freelancerId){
    return next(createError(400,"freelancer id is required"))
  }
  const bids = await Bid.find(
    {freelancerId : freelancerId}
  )
  .sort({ createdAt: -1 });

  if(!bids){
    return res.status(404).send(createError(404,"bids not found"))
  }

  res.status(200).send(bids);
};

export const acceptBid = async (req, res,next) => {
  const bidId = req.params.bidId
  
  if(!bidId){
    return next(createError(400,"bid id is required"))
  }
  const bid = await Bid.findById(bidId);
  
  if (!bid) {return res.status(404).send( 'Bid not found');}

  console.log(bid.freelancerId,"dssssssssssss");
  

  const freelancer= await User.findOne(
    {_id : bid.freelancerId}
  )

  if(!freelancer) {return res.status(404).send('freelancer not found')}
  console.log(freelancer);
  

  bid.status = 'accepted';
  await bid.save();  

  await sendEmail(
    freelancer.email,
    "Congratulations! Your Bid was Accepted",
    `Hello ${freelancer.username},\n\nYour bid for the project has been accepted!\n\nCheck your dashboard for more details.`
  );

res.status(200).send({bid,msg:"assepte"});
};

export const rejectBid = async (req, res,next) => {
  const {bidId} = req.params
  console.log(bidId);
  
  if(!bidId){
    return next(createError(404,"bid id is required"))
  }
  const bid = await Bid.findById(bidId);
  if (!bid) return next(createError(404,"bid not found"))

  const freelancer= await User.findOne(
    {_id : bid.freelancerId}
  )

  if(!freelancer) {return res.status(404).send('freelancer not found')}

  bid.status = 'rejected';
  await bid.save();

  await sendEmail(
    freelancer.email,
    "Sorry! Your Bid was rejected",
    `Hello ${freelancer.username},\n\nYour bid for the project has been rejected!\n.`
  );

  res.status(200).send({ msg: 'Bid Rejected', bid });
};

