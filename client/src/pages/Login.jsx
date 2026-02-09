import React from 'react'
import { Lock, Mail, User2Icon } from 'lucide-react'
import api from '../configs/api.js'
import {useDispatch} from 'react-redux'
import { login } from '../app/authSlice.js'
import { toast } from 'react-hot-toast'

const Login = () => {
    const dispatch=useDispatch();
    
    const query=new URLSearchParams(window.location.search);
    const urlState=query.get('state')
    const [state, setState] = React.useState(urlState ||"login")

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })

    const handleSubmit = async(e) => {
        e.preventDefault()
        try{
const {data}=await api.post(`/api/users/${state}`,formData)
 dispatch(login(data))
 localStorage.setItem('token',data.token);
 toast.success(data.message);

        }catch(error){
            toast.error(error.response?.data?.message || "An error occurred");
        }

    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md bg-white border border-gray-200 rounded-2xl px-8 shadow-xl"
  >
    <h1 className="text-black text-3xl mt-10 font-semibold text-center">
      {state === "login" ? "Login" : "Sign up"}
    </h1>

    <p className="text-gray-600 text-sm mt-2 text-center">
      Please {state} in to continue
    </p>

    {/* Name */}
    {state !== "login" && (
      <div
        className="flex items-center mt-6 w-full h-12 rounded-full px-5 gap-3
                   border border-gray-200 focus-within:border-green-500 transition"
      >
        <User2Icon size={16} className="text-gray-500" />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-transparent text-black placeholder-gray-500 outline-none border-none"
        />
      </div>
    )}

    {/* Email */}
    <div
      className="flex items-center mt-4 w-full h-12 rounded-full px-5 gap-3
                 border border-gray-200 focus-within:border-green-500 transition"
    >
      <Mail size={18} className="text-gray-500" />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full bg-transparent text-black placeholder-gray-500 outline-none border-none"
      />
    </div>

    {/* Password */}
    <div
      className="flex items-center mt-4 w-full h-12 rounded-full px-5 gap-3
                 border border-gray-200 focus-within:border-green-500 transition"
    >
      <Lock size={16} className="text-gray-500" />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full bg-transparent text-black placeholder-gray-500 outline-none border-none"
      />
    </div>

    {/* Forgot password */}
    <div className="mt-4 text-left">
      <button
        type="button"
        className="text-sm text-green-600 hover:underline"
      >
        Forgot password?
      </button>
    </div>

    {/* Submit */}
    <button
      type="submit"
      className="mt-5 w-full h-11 rounded-full
                 text-white font-medium
                 bg-green-600 hover:bg-green-700 transition"
    >
      {state === "login" ? "Login" : "Sign up"}
    </button>

    {/* Switch state */}
    <p
      onClick={() =>
        setState(prev => (prev === "login" ? "register" : "login"))
      }
      className="text-gray-600 text-sm mt-4 mb-10 text-center cursor-pointer"
    >
      {state === "login"
        ? "Don't have an account?"
        : "Already have an account?"}
      <span className="text-green-600 font-medium hover:underline ml-1">
        Click here
      </span>
    </p>
  </form>
</div>

  )
}

export default Login
