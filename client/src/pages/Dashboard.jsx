import { useEffect, useState } from "react";
import {
  PlusIcon,
  UploadCloudIcon,
  FilePenLineIcon,
  TrashIcon,
  PencilIcon,
  XIcon,
  LoaderCircleIcon,
} from "lucide-react";
import React from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from '../configs/api.js'
import { toast } from "react-hot-toast";
 import pdfToText from 'react-pdftotext'
//import "./index.css";
const Dashboard = () => {
  const{use,token}=useSelector(state=>state.auth);
  const navigate = useNavigate();
 const [editResumeId, setEditResumeId] = useState('');
  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [title, setTitle] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const[isLoading,setIsLoading]=useState(false);
 
  

  const colors = ["#34D399", "#60A5FA", "#FBBF24", "#F87171", "#A78BFA"];

  useEffect(() => {
     loadAllResumes();
  }, []);
  const loadAllResumes=async()=>{
    try{
     const { data } = await api.get('/api/users/resumes', {
  params: { title },
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      setAllResumes(data.resumes)

    }catch(error){
      toast.error(error.response?.data?.message ||error.message);
    }
  }
  const editTitle = async (e) => {
   try{
e.preventDefault();
   const {data}=await api.put('/api/resumes/update',{resumeId:editResumeId,
    resumeData:{title}},{
    headers:{Authorization:`Bearer ${token}`}
 })
 setAllResumes(allResumes.map(resume=>resume._id===editResumeId ?{...resume,title}:resume))
 setTitle('');
 setEditResumeId('');
 toast.success(data.message);
   }catch(error){
    toast.error(error.response?.data?.message || error.message);

   }
  }
  const deleteResume = async (resumeId) => {
   
    try{
       const confirm=window.confirm('Are you sure do you wnat to delete resume?');
    if(confirm){
      const {data}=await api.delete(`/api/resumes/delete/${resumeId}`,{
        headers:{Authorization:`Bearer ${token}`}
      });
     
      setAllResumes(allResumes.filter(resume=>resume._id!==resumeId))
       toast.success(data.message);
      
    }
    }
  catch(error){
    toast.error(error.response?.data?.message || error.message);
  }}
  /* ---------- CREATE ---------- */
  const createResume = async (e) => {
    try{
 e.preventDefault();
 const {data}=await api.post('/api/resumes/create',{title},{
    headers:{Authorization:`Bearer ${token}`}
 })
 setAllResumes([...allResumes,data.resume])
 setTitle('');
  setShowCreateResume(false);
  navigate(`/app/builder/${data.resume._id}`);
    }catch(error){
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  /* ---------- UPLOAD ---------- */
  const uploadResume = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try{
      const resumeText=await pdfToText(resumeFile);
      console.log("Extracted Resume Text:", resumeText);
      const {data}=await api.post('/api/ai/upload-resume',{title,resumeText},{

        headers:{Authorization:`Bearer ${token}`}
      })
      setTitle('');
      setResumeFile(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resume._id}`)


    }catch(error){
      toast.error(error.response?.data?.message ||error.message);

    }
    setIsLoading(false);

   
  };

  return (
    <div className="max-w-7xl mx-auto p-4 py-8">
      {/* Header */}
      <p className="text-2xl font-medium mb-6 sm:hidden">
        Welcome, Joe Doe
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowCreateResume(true)}
          className="w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg
          border border-dashed border-slate-300 hover:border-green-500 hover:shadow-lg transition-all"
        >
          <PlusIcon className="size-11 p-2.5 bg-gradient-to-br from-green-300 to-indigo-500 text-white rounded-full" />
          <p className="text-sm mt-2">Create New Resume</p>
        </button>

        <button
          onClick={() => setShowUploadResume(true)}
          className="w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg
          border border-dashed border-slate-300 hover:border-green-500 hover:shadow-lg transition-all"
        >
          <UploadCloudIcon className="size-11 p-2.5 bg-gradient-to-br from-green-300 to-indigo-500 text-white rounded-full" />
          <p className="text-sm mt-2">
            
          {isLoading && <LoaderCircleIcon className="size-5 mt-2 animate-spin text-green-600" />}
          {
            isLoading ? 'uploading..':'upload Resume'
          }
          </p>
        </button>
      </div>

      <hr className="border-slate-300 my-6 sm:w-[305px]" />

      {/* Resume Cards */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4">
        {allResumes.map((resume, index) => {
          const baseColor = colors[index % colors.length];

          return (
            <button
              key={index}
              onClick={()=>navigate(`/app/builder/${resume._id}`)}
              className="group relative w-full sm:w-40 h-56 rounded-lg shadow-md
              hover:shadow-xl transition-shadow border"
              style={{
                backgroundImage: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                borderColor: `${baseColor}40`,
              }}
            >
              <div className="flex justify-center mt-6">
                <FilePenLineIcon className="size-7" style={{ color: baseColor }} />
              </div>

              <p className="mt-4 px-2 text-sm text-center">
                {resume.title}
              </p>

              <p
                className="absolute bottom-1 w-full text-[11px] text-center"
                style={{ color: `${baseColor}90` }}
              >
                Updated on {new Date(resume.updatedAt).toLocaleDateString()}
              </p>

              <div onClick={e=>e.stopPropagation()} className="absolute top-1 right-1 hidden group-hover:flex gap-2">
                <TrashIcon onClick={()=>deleteResume(resume._id)} className="size-5 p-1 bg-red-100 text-red-600 rounded-full" />
                <PencilIcon className="size-5 p-1 bg-blue-100 text-blue-600 rounded-full" onClick={()=>{setEditResumeId(resume._id) ; setTitle(resume.title)}} />
              </div>
            </button>
          );
        })}
      </div>

      {/* ---------- CREATE MODAL ---------- */}
      {showCreateResume && (
        <form
          onSubmit={createResume}
          onClick={() => setShowCreateResume(false)}
          className="fixed inset-0 bg-black/50 z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg w-full max-w-sm p-6 relative"
          >
            <h2 className="text-xl font-semibold mb-4">Create New Resume</h2>

            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter resume title"
              className="w-full border px-3 py-2 mb-4"
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Create
            </button>

            <XIcon
              onClick={() => setShowCreateResume(false)}
              className="absolute top-4 right-4 cursor-pointer"
            />
          </div>
        </form>
      )}

      {/* ---------- UPLOAD MODAL ---------- */}
      {showUploadResume && (
        <form
          onSubmit={uploadResume}
          onClick={() => setShowUploadResume(false)}
          className="fixed inset-0 bg-black/50 z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg w-full max-w-sm p-6 relative"
          >
            <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>

            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter resume title"
              className="w-full border px-3 py-2 mb-4"
            />

            {/* FILE INPUT */}
            <input
              type="file"
              id="resume-input"
              accept=".pdf,.doc,.docx"
              className="hidden"
              hidden
              onChange={(e) => setResumeFile(e.target.files[0])}
            />

            <label htmlFor="resume-input" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center border border-dashed
                border-slate-400 rounded-md py-10 my-4 text-slate-400
                hover:border-green-500 hover:text-green-700 transition-colors">
                {resumeFile ? (
                  <p className="text-sm">{resumeFile.name}</p>
                ) : (
                  <>
                    <UploadCloudIcon className="size-11" />
                    <p>Upload resume</p>
                  </>
                )}
              </div>
            </label>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Upload
            </button>

            <XIcon
              onClick={() => setShowUploadResume(false)}
              className="absolute top-4 right-4 cursor-pointer"
            />
          </div>
        </form>
      )}
      {editResumeId && (
        <form
          onSubmit={editTitle}
          onClick={() => setEditResumeId('')}
          className="fixed inset-0 bg-black/50 z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg w-full max-w-sm p-6 relative"
          >
            <h2 className="text-xl font-semibold mb-4">Edit Resume Title</h2>

            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter resume title"
              className="w-full border px-3 py-2 mb-4"
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Update
            </button>

            <XIcon
              onClick={() =>{ setEditResumeId(''); setTitle('')}}
              className="absolute top-4 right-4 cursor-pointer"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
