import { Contact } from "../models/contect.model.js";
import createError from "../utils/createError.js";
import nodemailer from 'nodemailer'

export const createContact = async(req,res,next) => {
    try {
        const {email , username , subject, description } = req.body
        if([email,username,subject,description].some((field) => field?.trim === "")){
            return next(createError(400,"all field are required"))
        }
    
        const FormData = new Contact({
            email:email ,
            username:username ,
            subject:subject ,
            description:description ,
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER, 
              pass: process.env.EMAIL_PASS, 
            },
          });
      
          const mailOptions = {
            from: email,
            to: process.env.RECEIVER_EMAIL, 
            subject: `Contact Form - ${subject}`,
            text: `You've received a new contact form submission:\n\nUsername: ${username}\nEmail: ${email}\n\nDescription:\n${description}`,
          };
      
          await transporter.sendMail(mailOptions);
    
        await FormData.save();
    
        return res.status(200).send("contact is created")
    } catch (error) {
        return next(createError(500,"something wont wrong"))
    }
}

export const getContact = async(req,res,next) => {
    try {
        const response = await Contact.find()
        if(!response){
            return next(createError(400,"constact detail is not found"))
        }
        return res.status(200).send(response)
    } catch (error) {
        return next(createError(500,"something wont wrong"))
    }

}

export const deleteContact = async(req,res,next) => {
    try {
        const {id} = req.params
        if(!id){
            return next(createError(400,"id is required"))
        }

        await Contact.findByIdAndDelete(
            {_id : id}
        )
    
        return res.status(200).send("delete contact")
    } catch (error) {
        return next(createError(500,"something wants wrong"))
    }
}