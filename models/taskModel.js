const mongoose = require("mongoose")

const taskModel = new mongoose.Schema(
        {
        employe:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"employe"
        },
        title:String,
        description:String,
        status:String
    },
    { timestamps:true })

const task = mongoose.model("task",taskModel)

module.exports = task