import createError from "../utils/createError.js";
import Conversation from "../models/conversation.model.js";

// export const createConversation = async (req, res, next) => {
//   const newConversation = new Conversation({
//     id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId,
//     sellerId: req.isSeller ? req.userId : req.body.to,
//     buyerId: req.isSeller ? req.body.to : req.userId,
//     readBySeller: req.isSeller,
//     readByBuyer: !req.isSeller,
//   });

//   try {
//     const savedConversation = await newConversation.save();
//     res.status(201).send(savedConversation);
//   } catch (err) {
//     next(err);
//   }
// };

export const createConversation = async (req, res, next) => {

 const {senderId,receiverId} = req.body

 console.log(req.body);
 

 if(!senderId){
  res.status(400).send("senderId not found")
 }

 if(!receiverId){
  res.status(400).send("recevierId is not found")
 }

  const isExitsed = await Conversation.find(
    {
      member : {$all : [senderId,receiverId]}
    }
  )

  if(isExitsed.length > 0){
    console.log(isExitsed,'KKKKKKKKKKKKKK');
    
    return res.status(200).send(isExitsed)
  }

  const newConversation = new Conversation({
    member:
      [
        req.body.senderId,
        req.body.receiverId
      ],
      id : req.body.id
  });

  console.log(newConversation);


  try {
    console.log();

    const savedConversation = await newConversation.save();

    res.status(200).send(savedConversation)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const getConversationsUser = async (req, res, next) => {
  
  const userId = req.params.id
  console.log(userId);
  

  if(!userId){
    res.status(400).send("userId is messing")
  }
  
  try {
    const conversations = await Conversation.find({
      member: { $in: [userId]}
    });
    
    res.status(200).send(conversations)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const updateConversation = async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          // readBySeller: true,
          // readByBuyer: true,
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
        },
      },
      { new: true }
    );

    res.status(200).send(updatedConversation);
  } catch (err) {
    next(err);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ id: req.params.id });
    if (!conversation) return next(createError(404, "Not found!"));
    res.status(200).send(conversation);
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  console.log(req.body);
  
  try {
    const conversations = await Conversation.find(
      req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }
    ).sort({ updatedAt: -1 });
    res.status(200).send(conversations);
  } catch (err) {
    next(err);
  }
};