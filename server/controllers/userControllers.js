//POST:/api/users/register
import User from "../models/User.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import Resume from "../models/Resume.js";

const generateToken=(user)=>{
   const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
   return token;
}
export const register=async(req,res)=>{
try{
 const{name,email,password}=req.body;
 if(!name|| !email|| !password){
   return res.status(400).json({message:"Mising requied feilds"})

 }
 const user=await User.findOne({email})
if(user){
   return res.status(400).json({message:"User already exists"})
}
//create new user
const hashedpassword=await bcrypt.hash(password,10);
const newUser=await User.create({name,email,password:hashedpassword})
const token=generateToken(newUser._id);
newUser.password=undefined;
return res.status(201).json({message:"User created succefully",token,user:newUser});

}catch(error){
  console.error("Error registering user:", error);
  res.status(500).json({message:"Internal server error"})
}
}
//controller for userlogin
//POST:/api/users/login
export const login=async(req,res)=>{
   try{
      const{email,password}=req.body;
      const user=await User.findOne({email});
      if(!user){
         return res.status(400).json({message:"Invalid email"});
      }
      if(!user.comparePassword(password)){
         return res.status(400).json({message:"Invalid Password"});
      }
      const token=generateToken(user._id);
      user.password=undefined;
      return res.status(200).json({message:"Login successful",token,user});
   }catch(error){
      return res.status(400).json({message:error.message})
   }
}
//controller for getting user by id
export const getUserById=async(req,res)=>{
   try{
      const userId=req.userId;
      //check if user exists
      const user =await User.findById(userId);
      if(!user){
         return res.status(404).json({message:"user not found"});
      }
      // return user
      user.password=undefined;
      return res.status(200).json({user})
      
   }catch(error){
      return res.status(400).json({message:error.message})
   }
}
//controller for user resume/
//get:/api/users/resumes
export const getUserResumes=async(req,res)=>{
   try{
  const userId=req.userId;
  //return user resumes
  const resumes=await Resume.find({userId})
  return res.status(200).json({resumes});

   }catch(error){

   }
}
