import axios from "axios";
import OpenAI from "openai";

const getResumeSuggestions = async (resumeSection, data) => {

    const api_key = "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";
    const openai = new OpenAI({
        apiKey: api_key,
        dangerouslyAllowBrowser: true
    })
    const prompt = `Act as an interviewer, here is my ${resumeSection} section ${data} \n. give suggestions which i can improve in the given section`

    // console.log(prompt);
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "user",
                    "content": prompt
                },
            ],
            temperature: 1,
            max_tokens: 200,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        console.log(response.choices[0].message.content);
    }
    catch (error) {
        return error;
    }
}
export default getResumeSuggestions;