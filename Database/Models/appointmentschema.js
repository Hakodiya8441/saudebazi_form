const express = require('express');
const mongoose = require('mongoose');

const AppointmentSchema = mongoose.Schema({
    Shop_name:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "customer",
    },
    Date:{
        type: String,
        required: true
    },
    Time_slot: {
        type: String,
        required: true
    }
})

const appointment = new mongoose.model("appointment", AppointmentSchema);
module.exports = {
    appointment
}