//controller for enchancing a resume's professional summary
//post:/api/ai/enhance-pro-sum
import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";
export const enhanceProfessionalSummary=async(req,res)=>{
   try{
   const {userContent}=req.body;
   if(!userContent){
      return res.status(400).json({message:"missing required fields"})
     
   }
  const response= await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages: [
      {
         role: "system", 
         content:"You are an expert in resume writing Your task is to enchance the professional summary of a resume the summary should be 1-2 sentences also highlighthing key skills,experience ans carrer objectives.Make it compelling and ATS-friendly.and only return text no options or anything else."

        
      },
        {
            role: "user",
            content: userContent,
        },
    ],
});
const enhancedContent=response.choices[0].message.content;
return res.status(200).json({enhancedContent})


   }catch(error){

      return res.status(400).json({message:error.message})
   }
}
//controller for enchancing a resume 's job description
//post:/api/ai/enhance-job-des
export const enhanceJobDescription=async(req,res)=>{
   try{
   const {userContent}=req.body;
   if(!userContent){
      return res.status(400).json({message:"missing required fields"})
     
   }
  const response= await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages: [
      {
         role: "system", 
        content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job descriptionshould be only in 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else."     },
        {
            role: "user",
            content: userContent,
        },
    ],
});
const enhancedContent=response.choices[0].message.content;
return res.status(200).json({enhancedContent})


   }catch(error){

      return res.status(400).json({message:error.message})
   }
}
//import Resume from "../models/Resume.js";

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔹 AI CALL (assumes ai client already configured)
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You extract structured resume data and return ONLY valid JSON.",
        },
        {
          role: "user",
          content: `
Return JSON with:
professional_summary,
skills (array),
personal_info,
experience,
project,
education.

Resume text:
${resumeText}
`,
        },
      ],
      response_format: { type: "json_object" },
    });

    console.log("AI Response:", response);
    // 🔹 SAFE JSON PARSE
    let parsedData;
    try {
      parsedData = JSON.parse(response.choices[0].message.content);
    } catch {
      return res.status(500).json({ message: "Invalid AI JSON output" });
    }

    // 🔹 CRITICAL STEP: MAP AI → SCHEMA
    const mappedResume = {
      userId,
      title,

      professional_summary: parsedData.professional_summary || "",

      skills: Array.isArray(parsedData.skills)
        ? parsedData.skills
        : [],

      personal_info: {
        full_name: parsedData.personal_info?.full_name || "",
        profession: parsedData.personal_info?.profession || "",
        email: parsedData.personal_info?.email || "",
        phone: parsedData.personal_info?.phone || "",
        location: parsedData.personal_info?.location || "",
        linkedin: parsedData.personal_info?.linkedin || "",
        github: parsedData.personal_info?.github || "",
        website: parsedData.personal_info?.website || "",
      },

      experience: Array.isArray(parsedData.experience)
        ? parsedData.experience
        : [],

      project: Array.isArray(parsedData.project)
        ? parsedData.project
        : [],

      education: Array.isArray(parsedData.education)
        ? parsedData.education
        : [],
    };

    // 🔹 SAVE
     
    const newResume = await Resume.create(mappedResume);

    return res.status(201).json({
      message: "Resume uploaded successfully",     
      resume: newResume,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }

};
