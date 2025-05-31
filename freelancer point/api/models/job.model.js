import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    category: {type : String},
    requirements : {type:[String]},
    skillsRequired: {type: [String]},
    deadline: {type : Date},
    userId: {
        type: String,
        required: true,
    },
},{timestamps:true});

export const Job = mongoose.model('Job', jobSchema);

