import React from 'react'
import { GraduationCap, Plus, Trash2, Sparkles } from 'lucide-react';

const ProjectForm = ({data,onChange}) => {
   const addProject= () => {
         const newProject = {
            name: "",
            type: "",
            description: "",
           
         };
         onChange([...data, newProject]);
      };
      const removeProject= (index) => {
         const updated = data.filter((_, i) => i !== index);
         onChange(updated);
      };
      const updatesProject= (index, field, value) => {
         const updated = [...data];
         updated[index] = { ...updated[index], [field]: value };
         onChange(updated);
      };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semiboldetext-gray-900">
            Projects
          </h3>
          <p className="text-sm text-gray-500">Add your Projects</p>
        </div>

        <button
          onClick={addProject}
          className="flex items-center gap-2 px-3 py-1 
          text-sm bg-green-100 text-green-700 rounded-lg
          hover:bg-purple-200
 transition-colors"
        >
          <Plus className="size-4"></Plus>
          Add Project
        </button>
      </div>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
         <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
          <p> No Projects details added yet.</p>
          <p className="text-sm">Click "Add Projects " to get started</p>
        </div>
      ) : (
        <div>
          {data.map((project, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4>Project #{index + 1}</h4>
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-500 hover:text-red-700
                  transition-colrs"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid  gap-3">
                <input
                  value={project.name|| ""}
                  onChange={(e) =>
                    updatesProject(index, "name", e.target.value)
                  }
                  type="text"
                  placeholder="Project Name"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                <input
                  value={project.type|| ""}
                  onChange={(e) =>
                    updatesProject(index, "type", e.target.value)
                  }
                  type="text"
                  placeholder="Project type"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                <textarea
                rows={4}
                  value={project.description|| ""}
                  onChange={(e) =>
                    updatesProject(index, "description", e.target.value)
                  }
                 
                  placeholder="Project Description"
                  className="w-full px-3 py-2 text-sm rounded-lg resize-none"
                />
                
              
            
              
                  </div>
             
              
            </div>
          ))}
        </div>
      )}
    </div>
         
  )
}

export default ProjectForm
