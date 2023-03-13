// my-backend-function.js
import { json } from '@sveltejs/kit';
import { Configuration, OpenAIApi } from "openai";
import { apiKey } from '/api/embed/api_key.js';
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { input } = await request.json();

    const configuration = new Configuration({
        apiKey: apiKey
    });
    const openai = new OpenAIApi(configuration);

    // Call the embedings model text-embedding-ada-002
    const response = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: input
    });

    console.log(response.data.data);

    return json({
        data : response.data.data
    });
}