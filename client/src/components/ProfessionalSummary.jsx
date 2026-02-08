import React from 'react'
import { Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import {toast} from 'react-hot-toast';
import api from '../configs/api.js';

import { Loader2 } from 'lucide-react';

const ProfessionalSummary = ({data,onChange,setResumeData}) => {
  const {token}=useSelector(state=>state.auth);
  const[isGenerating,setIsGenerating]=useState(false);
  const generateSummary=async()=>{
    try{
       setIsGenerating(true);
       const prompt=`enhace my professional summary for my resume:${data}`;
       const response=await api.post('/api/ai/enhance-pro-sum',{
        userContent:prompt
       },
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      setResumeData(prev=>({...prev,professional_summary:response.data.enhancedContent}));
   setIsGenerating(false);
    }catch(error){
      toast.error("Error generating summary");
      setIsGenerating(false);
    }
  }
  
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
      <div>
         <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
      <p className='text-sm text-gray-500'>
         Add summary for your resume here

      </p>
      </div>
 
 <button disabled={isGenerating} onClick={generateSummary} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200
 transition-colors'>
  {isGenerating ?(<Loader2 className="animate-spin size-4"/>):(<Sparkles className="size-4"></Sparkles>)}
  {
    isGenerating ? "Generating...":"Enhance with AI"
  }
 

 </button>
      </div>
      
      <div className="mt-6">
 <textarea
  value={data || ""}
  onChange={(e) => onChange(e.target.value)
    
  }
  placeholder="Write a compelling professional summary that highlights your key strengths and career objectives."
  className="
    w-full
    min-h-[140px]
    rounded-lg
    border border-gray-300
    bg-white
    px-4 py-3
    text-sm text-gray-800
    placeholder:text-gray-400
    resize-none
    transition-all duration-200

    hover:border-gray-400

    focus:outline-none
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-500/20
  "
></textarea>

     <p>Tip keep it concise(3-4 sentences) and focus on your most relevant achievements and skills</p>
      </div>
    </div>
  )
}

export default ProfessionalSummary;
