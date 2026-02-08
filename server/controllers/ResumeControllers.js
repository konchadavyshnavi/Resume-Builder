//controller for creating new Resumue
//Post :/api/resumes/create
import { json } from "express";
import Resume from "../models/Resume.js";
import imageKit from "../configs/imageKit.js";
import fs from "fs";
export const createResume=async(req,res)=>{
   try{
 const userId=req.userId;
 const {title}=req.body;
 console.log(userId,title);
 const newResume=(await Resume.create({userId,title}));

 if(!newResume){
    return res.status(400).json({message:"Error creating resume"});
 }
 console.log(newResume);
   return res.status(201).json({message:"Resume created successfully",resume:newResume});
   }catch(error){
    return res.status(500).json({message:"Error creating resume",error:error.message});
   }
}
//controller for delete resume
//Delete:/api/resumes/delete
export const deleteResume=async(req,res)=>{
   try{
  const userId=req.userId;
  const{resumeId}=req.params;
  await Resume.findOneAndDelete({_id:resumeId,userId});
   return res.status(200).json({message:"Resume deleted successfully"});
   }catch(error){
    return res.status(500).json({message:"Error deleting resume",error:error.message});
   }
}
//get user Resume by Id;
export const getResumeById=async(req,res)=>{
   try{
  const userId = req.userId;


  const{resumeId}=req.params;
  console.log(userId,resumeId);
  const resume=await Resume.findOne({_id:resumeId,userId});
  if(!resume)
   return res.status(404).json({message:"Resume not found"});
const resumeObj = resume.toObject();
    delete resumeObj.__v;
    delete resumeObj.createdAt;
    delete resumeObj.updatedAt;

   return res.status(200).json({resume:resumeObj});
   }catch(error){
    return res.status(500).json({message:"Error getting resume",error:error.message});
   }

}
//get resume by id public
//Get:api/resume/public
export const getPublicResumeById=async(req,res)=>{
   try{
      const{resumeId}=req.params;
      const resume=await Resume.findOne({_id:resumeId,public:true});
      if(!resume){
         return res.status(404).json({message:"Resume not found"});
      }
      return res.status(200).json({resume});

   }catch(error){
      return res.status(500).json({message:"Error getting resume",error:error.message});


   }

}
//controller for updating for our resume
export const updateResume=async(req,res)=>{
   try{
   const userId=req.userId;
   
   const {resumeId,resumeData,removeBackground,accent_color}=req.body;
   console.log(resumeData.accent_color);
   console.log(req.body);
   const image=req.file;
   let resumeDataCopy=JSON.parse(resumeData);
   const transformations = [
  'w-300',
  'h-300',
  'fo-face',
  'z-0.75'
];
const cleanColor = accent_color
  ? accent_color.replace('#', '').toUpperCase()
  : null;

if (removeBackground === 'yes') {
  transformations.push('e-bgremove');
   if(cleanColor){
       transformations.push(`b-${cleanColor}`);
   }
}
   if(image){
      const imageBufferData=fs.createReadStream(image.path);
      const response = await imageKit.files.upload({
  file: imageBufferData,
  fileName: 'resume.png',
  folder:'user-resumes',
  transformation:{
   pre:transformations.join(',')
  }
});
resumeDataCopy.personal_info.image=response.url;
   }
   const resume = await Resume.findOneAndUpdate(
  { userId, _id: resumeId },
  { $set: resumeDataCopy },
  { new: true }
);

   



   return res.status(200).json({message:"Resume updated successfully",resume});

   }catch(error){
      return res.status(500).json({message:"Error updating resume",error:error.message});
   }
}
