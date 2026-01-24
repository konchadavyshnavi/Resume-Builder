import React from 'react'
import {User} from 'lucide-react';
import {Phone,Mail} from 'lucide-react';
import {BriefcaseBusiness} from 'lucide-react';
const required=true;

export const PersonalInForm = ({data,onChange,removeBackground,setRemoveBackground}) => {
 const handleChange=(field,value)=>{
    onChange({...data,[field]:value})
  }
  const fields=[
   { key:"full_name",label:"Full Name",type:"text",icon:User,required },
  { key:"email",label:"Email Address",type:"email",icon:User,required },
  { key:"phone",label:"Phone Number",type:"tel",icon:Phone,required },
  { key:"location",label:"Location",type:"text",icon:User,required },
  { key:"profession",label:"Profession",type:"text",icon:BriefcaseBusiness, required },
  { key:"linkedin",label:"LinkedIn Profile",type:"url",icon:User,required },
  { key:"website",label:"Website",type:"url",icon:Mail,required:false },
]
   return (
    <div>
   <h3 className='text-lg font-semibold text-gray-900'>
      Personal Information
   </h3>
   <p className='text-sm text-gray-600'>Get Started with Personal Information</p>
    <div className='flex items-center gap-2'>
      <label>
         {data.image ? (
            <img src={typeof data.image==='string'? data.image : 
URL.createObjectURL(data.image)} alt="Profile" className=
'w-16 h-16 rounded-full object-cover mt-5 ring-slate-300 hover:opacity-80'/>

            
         ):(<div className='inline-flex items-center gap-2 mt-5 text-slate '>
            <User className='size-10 p-2.5 border rounded-full'/>
            upload user image
            </div>
         )}
         <input type="file" accept="image/jpeg,image/png" className="hidden"
         onChange={(e)=>{handleChange("image",e.target.files[0])}}/>
      </label>
      {
         typeof data.image === "object" && (
  <div className="flex flex-col gap-1 pl-4 text-sm">
    <p>Remove Background</p>

    <label className="relative inline-flex items-center cursor-pointer gap-3">
      <input
        type="checkbox"
        className="sr-only peer"
        onChange={() => setRemoveBackground(prev => !prev)}
        checked={removeBackground}
      />

      {/* Track */}
      <div className="w-10 h-6 bg-gray-300 rounded-full
                      peer-checked:bg-green-600
                      transition-colors duration-300">
      </div>

      {/* Thumb */}
      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full
                       transition-transform duration-300
                       peer-checked:translate-x-4">
      </span>
    </label>
  </div>
)

      }
    </div>

{
  fields.map((field)=>{
    const Icon=field.icon;
    return(
      <div key={field.key} className='space-y-1 mt-5'>
<label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
  <Icon className="size-4"/>
  {field.label}
  {field.required && <span className="text-red-500">*</span>}
</label>
<input type={field.type} 
className='mt-1 w-full px-3 py-2 border-gray-300
rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none
transition-colors text-sm'
placeholder={`Enter your ${field.label.toLowerCase()}`}
required={field.required}
value={data[field.key] || ""}
onChange={(e)=>handleChange(field.key,e.target.value)}

/>
        </div>
    )
  })
}
    </div>
  )
}
export default PersonalInForm;
