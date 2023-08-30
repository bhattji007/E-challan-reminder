import mongoose from "mongoose";

const userData=new  mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    vehicle:{
        type:String,
        required:true
    },
    
})
const userSchema=mongoose.model('userData',userData);
export default userSchema