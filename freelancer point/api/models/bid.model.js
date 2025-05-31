import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
    jobId: {
      type: String,
      required: true
    },
    freelancerId: {
      type: String,
      required: true
    },
    proposalText: {
      type: String,
      required: true
    },
    proposedAmount: {
      type: Number,
      required: true
    },
    estimatedDays: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }, { timestamps: true });

  export const Bid = mongoose.model("Bid",bidSchema) 