// my-backend-function.js
import { json } from '@sveltejs/kit';
import { Configuration, OpenAIApi } from "openai";
import { apiKey } from '$env/static/private';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { text } = await request.json();

    const configuration = new Configuration({
        apiKey: apiKey
    });
    const openai = new OpenAIApi(configuration);

    console.log(text);

    // Call the embedings model text-embedding-ada-002
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: text}],
      });

    
    console.log(completion.data.choices[0].message);

    return json({
        data : completion.data.choices[0].message
    });
}