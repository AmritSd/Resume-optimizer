// my-backend-function.js
import { json } from '@sveltejs/kit';
import { Configuration, OpenAIApi } from "openai";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { input } = await request.json();

    const configuration = new Configuration({
        apiKey: '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'
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