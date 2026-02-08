import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Preview from "./pages/Preview.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Layout from "./pages/Layout.jsx";
import { useDispatch } from "react-redux";
import api from "./configs/api.js";
import { login } from "./app/authSlice.js";
import{ useEffect } from "react";
import {setLoading} from"./app/authSlice.js"
import {Toaster} from 'react-hot-toast'

const App = () => {
  const dispatch=useDispatch();
  const getUserData=async()=>{
    const token=localStorage.getItem('token');
    try{
    if(token){
      const{data}=await api.get('/api/users/data',{
        headers:{Authorization:`Bearer ${token}`}
      })
      if(data.user){
        dispatch(login({token,user:data.user}))
      }
      dispatch(setLoading(false));


    }
  else{
    dispatch(setLoading(false));
  }}catch(error){
 
    dispatch(setLoading(false));
    console.log(error.message);
    }
  }
  useEffect(()=>{
    getUserData()
  },[])
  return (
    <>
    <Toaster></Toaster>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="app" element={<Layout/>} >
      <Route index element={<Dashboard/>}/>
      <Route path='builder/:resumeId'element={<ResumeBuilder/>}/>
      </Route>
      <Route path="view/:resumeId" element={<Preview />} />
      <Route path="login" element={<Login />} />
    </Routes>
    </>
  );
};

export default App;
