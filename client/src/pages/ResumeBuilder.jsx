import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeftIcon, Download, EyeIcon, EyeOffIcon } from "lucide-react";
import { User, FileText, Briefcase, FolderOpen, Sparkles } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PersonalInForm from "../components/PersonalInForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummary from "../components/ProfessionalSummary";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import { BookOpen } from "lucide-react";
import SkillsForm from "../components/SkillsForm";
import { Share2Icon
 } from "lucide-react";
 import api from '../configs/api.js';
 import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const {token}=useSelector((state)=>state.auth)

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82f6",
    public: false,
  });

  const loadExistingResume = async() => {
    try{
      const {data}=await api.get(`/api/resumes/get/${resumeId}`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      if(data.resume){
        setResumeData(data.resume)
        document.title=data.resume.title;
      }
    }catch(error){
      console.log(error)
    }
  };
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal  Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    {id:"education",name:"Education",icon:BookOpen},
    { id: "projects", name: "Projects", icon: FolderOpen },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];
  const activeSection = sections[activeSectionIndex];

  useEffect(() => {
    loadExistingResume();
  }, []);
const changeResumeVisibility=async()=>{
  try{
    const formData=new FormData();
    formData.append("resumeId",resumeId);
    formData.append("resumeData",JSON.stringify({public:!resumeData.public}));
     const {data}=await api.put('/api/resumes/update',formData,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
       setResumeData({...resumeData,public: !resumeData.public})
       toast.success(data.message);

  }catch(error){
  console.log("error saving in resume",error);

  }
}
const saveResume=async()=>{
  try{
let updatedResumeData = JSON.parse(JSON.stringify(resumeData));

 if(typeof resumeData.personal_info.image instanceof File){
  delete updatedResumeData.personal_info.image;
 }
 const formData=new FormData();
 formData.append("resumeId",resumeId);
  formData.append("resumeData",JSON.stringify(updatedResumeData));
  removeBackground && formData.append("removeBackground","yes");
  formData.append("accent_color",resumeData.accent_color);
  typeof resumeData.personal_info.image==='object' && formData.append("image",resumeData.personal_info.image);
  const {data}=await api.put('/api/resumes/update',formData,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  console.log(data.resume);
  setResumeData(data.resume);
    toast.success(data.message);
  }catch(error){
    console.error("error in saving in resume",error);
    toast.error(error.response?.data?.message || "Error saving resume");

  }
}
const handleShare = async () => { 
  const frontendUrl = window.location.origin;
  const resumeUrl = frontendUrl + '/view/' + resumeId;

  if (navigator.share) {
    try {
      await navigator.share({
        url: resumeUrl,
        text: "My Resume",
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    alert('share not supported on this browser');
  }
};

const downloadResume=()=>{
  window.print();
}
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/*Left Panel-Form */}
          <div className="relate lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              {/*progress bar using activeSectionIndex*/}
              <hr className="absolute top-0 left-0 right-0 border-3 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from green-500 to green-600 border-none transition-all duration-300"
                style={{ width: `${(activeSectionIndex * 100) /(sections.length-1)}%` }}
              />
           
          {/* Section Navigation */}
          <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
            <div className='flex items-center gap-2'>
              <TemplateSelector  selectedTemplate={resumeData.template}
              onChange={
                (template)=> setResumeData(prev=>({
                  ...prev,template
                }))
              }></TemplateSelector>
              <ColorPicker selectedColor={resumeData.accent_color}
              onChange={(color)=>setResumeData(prev=>({
                ...prev,accent_color:color
              }))}></ColorPicker>
            </div>
            <div className="flex item-center">
              {activeSectionIndex !== 0 && (
                <button
                  onClick={() =>
                    setActiveSectionIndex((prevIndex) =>
                      Math.max(prevIndex - 1, 0),
                    )
                  }
                  disabled={activeSectionIndex === 0}
                  className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                >
                  perivous
                  <ChevronLeft className="size-4" />
                  
                </button>
              )}
              <button
                  onClick={() =>
                    setActiveSectionIndex((prevIndex) =>
                      Math.min(prevIndex + 1, sections.length-1 ),
                    )
                  }
                  disabled={activeSectionIndex === sections.length - 1}
                  className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                    activeSectionIndex === sections.length - 1 && 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="size-4" />
                Next
                </button>
                 </div>
          </div>
            {/*Form Content */}
          <div className='space-y-6'>
           {
           activeSection.id==='personal' &&(
            <PersonalInForm  data={resumeData.personal_info}
            onChange={(data)=>setResumeData(prev=>({
              ...prev,personal_info:data
            }))} removeBackground={removeBackground}
         setRemoveBackground={setRemoveBackground}
         />)
         }
         {
          activeSection.id==='summary' && (
            <div>
              <ProfessionalSummary data={resumeData.professional_summary}
              onChange={(data)=>setResumeData(prev=>(
                {
                  ...prev,professional_summary:data
                }
              ))} setResumeData={setResumeData}/>
            </div>
          )
         }
          {
          activeSection.id==='experience' && (
            <div>
              <ExperienceForm data={resumeData.experience}
              onChange={(data)=>setResumeData(prev=>(
                {
                  ...prev,experience:data
                }
              ))} />
            </div>
          )
         }
          {
          activeSection.id==='education' && (
            <div>
              <EducationForm data={resumeData.education}
              onChange={(data)=>setResumeData(prev=>(
                {
                  ...prev,education:data
                }
              ))} />
            </div>
          )
         }
         {
          activeSection.id==='projects' && (
            <div>
              <ProjectForm data={resumeData.project}
              onChange={(data)=>setResumeData(prev=>(
                {
                  ...prev,project:data
                }
              ))} />
            </div>
          )
         }
{
          activeSection.id==='skills' && (
            <div>
              <SkillsForm data={resumeData.skills}
              onChange={(data)=>setResumeData(prev=>(
                {
                  ...prev,skills:data
                }
              ))} />
            </div>
          )
         }
          </div>
          <button className='bg-gradient-to-br from-green-100 to-green-200
          ring-green-300 text-green-600 ring hover:ring-green-400
          transition-all rounded-md px-6 py-2 mt-6 text-sm' onClick={()=>{
            toast.promise(saveResume,{loading:"saving"})
          }}>
            Save Changes
          </button>
            </div>
          </div>
          {/* Right panel form*/}

          <div className='lg:col-span-7 max-lg:mt-6'>
            <div className='relative w-full'>
              <div className='absolute bottom-3  flex items-center
              justify-end gap-4 right-4 z-10'>
                {
                  resumeData.public &&(
                    <button className='flex items-center p-2 px-4 gap-2 text-xs
bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600
rounded-lg ring-blue-300 hover: ring transition-colors'
onClick={handleShare}>
<Share2Icon className='size-4'/>share
</button>
                  )
                }
               <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2
text-xs bg-gradient-to-br from-purple-100 to-purple-200
text-purple-600 ring-purple-300 rounded-1g hover:ring
transition-colors'>
                  {
                    resumeData.public ? <EyeIcon className='size-4'/> :
                    <EyeOffIcon className='size-4'/>
                  }
                  {
                    resumeData.public ?"Public" :"Private"
                  }
                </button>
                <button className='flex items-center gap-2 px-6 py-2 text-xs
bg-gradient-to-br from-green-100 to-green-200 text-green-600
rounded-lg ring-green-300 hover:ring transition-colors' onClick={downloadResume}>
I<Download className='size-4'/>Dowload

</button>
              </div>
            
            </div>
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes="mx-auto shadow-lg"/>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
