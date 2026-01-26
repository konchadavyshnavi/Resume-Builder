//import { GraduationCap } from 'lucide-react';
import React from 'react'
import { GraduationCap, Plus, Trash2, Sparkles } from 'lucide-react';


const EducationForm = ({data=[] ,onChange}) => {
      const addEducation= () => {
         const newEducation = {
            institution: "",
            degree: "",
            field: "",
            graduation_date: "",
            
            gpa:"",
         };
         onChange([...data, newEducation]);
      };
      const removeEducation = (index) => {
         const updated = data.filter((_, i) => i !== index);
         onChange(updated);
      };
      const updatesEducation = (index, field, value) => {
         const updated = [...data];
         updated[index] = { ...updated[index], [field]: value };
         onChange(updated);
      };

      return (
         
       <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semiboldetext-gray-900">
            Education
          </h3>
          <p className="text-sm text-gray-500">Add your Education details</p>
        </div>

        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 
          text-sm bg-green-100 text-green-700 rounded-lg
          hover:bg-purple-200
 transition-colors"
        >
          <Plus className="size-4"></Plus>
          Add Education
        </button>
      </div>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
         <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
          <p> No Education details added yet.</p>
          <p className="text-sm">Click "Add Education " to get started</p>
        </div>
      ) : (
        <div>
          {data.map((education, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4>Education #{index + 1}</h4>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700
                  transition-colrs"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={education.institution|| ""}
                  onChange={(e) =>
                    updatesEducation(index, "institution", e.target.value)
                  }
                  type="text"
                  placeholder="institution Name"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                <input
                  value={education.degree || ""}
                  onChange={(e) =>
                    updatesEducation(index, "degree", e.target.value)
                  }
                  type="text"
                  placeholder="Degree"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                <input
                  value={education.field || ""}
                  onChange={(e) =>
                    updatesEducation(index, "field", e.target.value)
                  }
                  type="text"
                  placeholder="Field of Study"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                <input
                  value={education.graduation_date || ""}
                  //disable={experience.is_current}
                  onChange={(e) =>
                    updatesEducation(index, "graduation_date", e.target.value)
                  }
                  type="month"
                  placeholder="Job Title"
                  className="px-3 py-2 text-sm rounded-lg disable:bg-gray-100"
                />
            
              <input
                  value={education.gpa|| ""}
                  onChange={(e) =>
                    updatesEducation(index, "gpa", e.target.value)
                  }
                  type="text"
                  placeholder="GPA"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                  </div>
             
              
            </div>
          ))}
        </div>
      )}
    </div>
         
      );
   }

export default EducationForm
