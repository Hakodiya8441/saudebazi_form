const express = require('express');
const router = express.Router();
const {appointment} = require("../Models/appointmentschema");
// const mongoose = require('mongoose');

    router.post("/appoint",async(req,resp)=>{
        try{
            const {Shop_name,Date,Time_slot} = req.body;
            const slots = await appointment.insertMany({
                Shop_name: Shop_name,
                Date: Date,
                Time_slot: Time_slot
            });
            resp.status(201).json({message:"Appointment adding successfully", data: slots})
        }
        catch(error){
            console.error("Error adding appointment:", error);
            resp.status(500).json({message: "Internal Server Error"})
        }
    })
    router.get("/appointments",async(req,resp)=>{
        const slots = await appointment.find();
        resp.status(200).json(slots);
    })

module.exports = router;