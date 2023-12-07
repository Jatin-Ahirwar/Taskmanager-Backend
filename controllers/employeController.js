const path = require("path");
const { catchAsyncError } = require("../middlewares/catchAsyncError");
const employes = require("../models/employeModel");
const taskModel = require("../models/taskModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendtoken } = require("../utils/employeSendToken");

exports.homepage = catchAsyncError(async (req,res,next)=>{
        res.json({message:"secure homepage"}); 
})

exports.currentEmploye = catchAsyncError(async (req, res, next) => {
  const employe = await employes.findById(req.id)
    .populate("tasks")
    .exec();
  res.json(employe);
});


exports.employesignup = catchAsyncError(async (req,res,next)=>{
    const employe = await new employes(req.body).save()
    sendtoken(employe,201,res)
    // res.json(req.body)
})


exports.employesignin = catchAsyncError(async (req,res,next)=>{
    const employe = await employes.findOne({email : req.body.email}).select("+password").exec()
    if(!employe) {
            return next (new ErrorHandler("user not not exist with this email. " , 404))
    }
    const ismatch = employe.comparepassword(req.body.password)
    if(!ismatch){
            return next (new ErrorHandler("wrong Credentials",500))
    }
    sendtoken(employe,201,res)
})

exports.employesignout = catchAsyncError(async (req,res,next)=>{
    res.clearCookie("token")
    res.json({message:"signed out succesfully"})
})



// -------------------------- task ------------------------------


exports.createtask = catchAsyncError(async (req,res,next)=>{
    const employe = await employes.findById(req.id).exec()
    const tasks = await new taskModel(req.body)
    tasks.employe = employe._id
    employe.tasks.push(tasks._id)
    await tasks.save()    
    await employe.save()    
    res.status(201).json({success:true , tasks})
})


exports.readtasks = catchAsyncError(async (req,res,next)=>{
    const { tasks } = await employes.findById(req.id).populate("tasks").exec()
    res.status(201).json({success:true , tasks})
})



exports.readsingletask = catchAsyncError(async (req,res,next)=>{
    const task = await taskModel.findById(req.params.id).exec()
    if(!task){
        return next (new ErrorHandler("task not found" , 500))
    }
    console.log(task)
    res.status(201).json({success:true , task})
})


exports.deletetask = catchAsyncError(async (req,res,next)=>{
    const task = await taskModel.findByIdAndDelete(req.params.id).exec()
    if(!task){
        return next (new ErrorHandler("task not found" , 500))
    }
    res.status(201).json({success:true , task})
})


exports.updatetask = catchAsyncError(async (req,res,next)=>{
    const updatedtask = await taskModel.findById(req.params.id,req.body).exec()
    if(!updatedtask){
        return next (new ErrorHandler("task not found" , 500))
    }
    res.status(201).json({success:true ,updatedtask})
})

