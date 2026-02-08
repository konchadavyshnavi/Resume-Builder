import React from "react";
import { Plus, Sparkles } from "lucide-react";
import { Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../configs/api.js";
import { Loader2 } from "lucide-react";

const ExperienceForm = ({ data, onChange }) => {
  const { token } = useSelector((state) => state.auth);
  const [GeneratingIndex, setGeneratingIndex] = useState(-1);
  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
  };
  const removeExperience = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };
  const updatesExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };
  const generateDescription = async (index) => {
    setGeneratingIndex(index);
    const experience = data[index];
    const prompt = `enhance this job description ${experience.description} for the
position of ${experience.position} at ${experience.company}.`;

    try {
      const { data } = await api.post(
        "api/ai/enhance-job-des",
        { userContent: prompt },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      updatesExperience(index, "description", data.enhancedContent);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGeneratingIndex(-1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semiboldetext-gray-900">
            Professional Experience
          </h3>
          <p className="text-sm text-gray-500">Add your experience</p>
        </div>

        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-1 
          text-sm bg-green-100 text-green-700 rounded-lg
          hover:bg-purple-200
 transition-colors"
        >
          <Plus className="size-4"></Plus>
          Add Experience
        </button>
      </div>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p> No work experience added yet</p>
          <p className="text-sm">Click "Add Experince " to get started</p>
        </div>
      ) : (
        <div>
          {data.map((experience, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4>Experience #{index + 1}</h4>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700
                  transition-colrs"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={experience.company || ""}
                  onChange={(e) =>
                    updatesExperience(index, "company", e.target.value)
                  }
                  type="text"
                  placeholder="Company Name"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                <input
                  value={experience.position || ""}
                  onChange={(e) =>
                    updatesExperience(index, "position", e.target.value)
                  }
                  type="text"
                  placeholder="Position"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                <input
                  value={experience.start_date || ""}
                  onChange={(e) =>
                    updatesExperience(index, "start_date", e.target.value)
                  }
                  type="month"
                  placeholder="Job Title"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                <input
                  value={experience.end_date || ""}
                  disable={experience.is_current}
                  onChange={(e) =>
                    updatesExperience(index, "end_date", e.target.value)
                  }
                  type="month"
                  placeholder="Job Title"
                  className="px-3 py-2 text-sm rounded-lg disable:bg-gray-100"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={experience.is_current || false}
                  onChange={(e) => {
                    updatesExperience(
                      index,
                      "is_current",
                      e.target.checked ? true : false,
                    );
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Job description</label>
                  <button
                    disabled={
                      GeneratingIndex !== -1 && GeneratingIndex !== index
                    }
                    onClick={() => generateDescription(index)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100"
                  >
                    {GeneratingIndex === index ? (
                      <Loader2 className="animate-spin w-3 h-3" />
                    ) : (
                      <div>
                        <Sparkles className="w-3 h-3" />
                        "Enchance with AI"
                      </div>
                    )}
                  </button>
                </div>
                <textarea
                  value={experience.description || ""}
                  onChange={(e) =>
                    updatesExperience(index, "description", e.target.value)
                  }
                  rows={4}
                  className="w-full text-sm px-3 py-2 rounded-lg resize-none"
                  placeholder="Describe about your job"
                ></textarea>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
