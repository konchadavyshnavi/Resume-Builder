import axios from 'axios'

const api = axios.create({
  baseURL: process.env.backendurl,
})

export default api
