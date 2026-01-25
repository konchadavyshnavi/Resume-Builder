import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import { ArrowLeftIcon } from "lucide-react";
import { User, FileText, Briefcase, FolderOpen, Sparkles } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PersonalInForm from "../components/PersonalInForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";


const ResumeBuilder = () => {
  const { resumeId } = useParams();

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82f6",
    public: false,
  });

  const loadExistingResume = () => {
    const resume = dummyResumeData.find((r) => r._id === resumeId);
    if (resume) {
      setResumeData(resume);
      document.title = resume.title || "Resume Builder";
    }
  };
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal  Info", icon: User },
    { id: "Summary", name: "Summary", icon: FileText },
    { id: "Experience", name: "Experience", icon: Briefcase },
    // {id:"Education",name:"Education",icon:BookOpen},
    { id: "Projects", name: "Projects", icon: FolderOpen },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];
  const activeSection = sections[activeSectionIndex];

  useEffect(() => {
    loadExistingResume();
  }, []);

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
           {activeSection.id==='personal' &&(
            <PersonalInForm  data={resumeData.personal_info}
            onChange={(data)=>setResumeData(prev=>({
              ...prev,personal_info:data
            }))} removeBackground={removeBackground}
         setRemoveBackground={setRemoveBackground}
         />)}
          </div>
            </div>
          </div>
          {/* Right panel form*/}

          <div className='lg:col-span-7 max-lg:mt-6'>
            <div>
              {/*button--*/}
            </div>
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes="mx-auto shadow-lg"/>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
