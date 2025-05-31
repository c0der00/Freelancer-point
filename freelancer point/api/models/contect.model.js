import mongoose, { model, Schema } from "mongoose";

const ContactUs = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
},{timestamps : true})

export const Contact = model("Contact",ContactUs)