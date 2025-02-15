const express = require("express");
const Feedback = require("../Models/FeedbackSchema")

const router = express.Router();

// post 

router.post("/add-feedback", async(req,res)=>{
try{
    const {customer_id , feedback , feedbacks, additional_comments} = req.body;

    if (!customer_id || !feedback || !feedbacks) {
        return res.status(400).json({ error: "Missing required fields or empty feedbacks array." });
      }

    const newFeedback = new Feedback({
        customer_id,
        feedback,
        feedbacks,
        additional_comments
    })

    await newFeedback.save();
    res.status(201).json({message:"Feedback added successfully",feedback:newFeedback});
}catch(error){
    res.status(500).json({message:error.message});
}
})


// get 

router.get("/feedbacks", async (req, res) => {
    try {
      const feedbacks = await Feedback.find();
      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;