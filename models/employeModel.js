const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const employeModel = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Ft name is required"],
    },
    email:{
        type:String,
        unique:true,
        required:[true, "Email is required"],
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password:{
        select:false,
        type:String,
        maxlength:[15,"Password should not exceed more than 15 characters"],
        minlength:[6,"Password should have atleast 6 characters"],
    },

    tasks:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"task"
        }
    ],
    
    },
    { timestamps:true })

employeModel.pre("save", function(){
    if(!this.isModified ("password")){
        return;
    }
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password , salt)
});


employeModel.methods.comparepassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

employeModel.methods.getjwttoken = function (){
    return  jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}


const employe = mongoose.model("employe",employeModel)

module.exports = employe