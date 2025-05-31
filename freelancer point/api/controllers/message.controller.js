import createError from "../utils/createError.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { login } from "./auth.controller.js";
import { uploadOnCloudinary } from "../utils/clodinary.utils.js";

// export const createMessage = async (req, res, next) => {
//   const newMessage = new Message({
//     conversationId: req.body.conversationId,
//     userId: req.body.userId,
//     desc: req.body.desc,
//   });
//   try {
//     // console.log(req.body);
    
//     const savedMessage = await newMessage.save();
//     // await Conversation.findOneAndUpdate(
//     //   { id: req.body.conversationId },
//     //   {
//     //     $set: {
//     //       readBySeller: req.isSeller,
//     //       readByBuyer: !req.isSeller,
//     //       lastMessage: req.body.desc,
//     //     },
//     //   },
//     //   { new: true }
//     // );

//     res.status(201).send(savedMessage);
//   } catch (err) {
//     next(err);
//   }
// };

export const createMessage = async (req, res, next) => {
  try {
    const filePath = req.files?.file[0]?.path

    console.log(filePath);
    

    if(!filePath){
      return res.status(400).send("Please upload path is required.")
    }

    const file = await uploadOnCloudinary(filePath)
    
    if(!file){
      return res.status(400).send("Please upload an file")
    }


    const newMessage = new Message({
      conversationId: req.body.conversationId,
      userId: req.body.userId,
      desc: req.body.desc,
      file: req.files ?  file.url : null,
    });

    const savedMessage = await newMessage.save();

    res.status(201).send(savedMessage);
  } catch (err) {
    next(err);
  }
};


export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id });
    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};

export const getLastMessge = async(req,res) => {
  
  const {conversationId,friendId} = req.params
  console.log(req.params);
  

  if(!conversationId){
    res.status(400).send("conversation id is required")
  }

  if(!friendId){
    res.status(400).send("friend id is required")
  }

  try {
    const message = await Message.findOne({
      conversationId : conversationId,
      userId : friendId
    }).sort({timestamp: -1})
    
    res.status(200).send(message)
  } catch (error) {
    res.status(500).send(error)
  }
}