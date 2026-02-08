import OpenAI from "openai";

const ai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
   baseURL: process.env.baseURL,
});
export default ai;
