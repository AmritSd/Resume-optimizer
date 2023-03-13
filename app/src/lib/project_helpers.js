import { cosine_similarity } from '$lib/helper_functions.js'


export function get_text(lines) {
    return lines.map((line) => {
        return line.text;
    });
}

export async function embed(data) {
    data = get_text(data.lines);
    console.log(data);
    const response = await fetch('/api/embed', {
        method: 'POST',
        body: JSON.stringify({ input: data }),
        headers: {
            'content-type': 'application/json'
        }
    });
    // Get the response data as JSON
    let output = await response.json();
    console.log(output);
    // covnert to array
    output = Object.keys(output).map(function(key) {
        return output[key];
    });

    console.log(output);

    if(output[0] === 'Internal Error') {
        return [];
    }
    return output[0].map((item) => {
        return item.embedding;
    });
}



export const get_similarities = (jd_vec, other_vecs) => {

    if(jd_vec.length == 0) {
        return [];
    }

    let similarities = [];

    for(let i = 0; i < other_vecs.length; i++) {
        similarities.push(cosine_similarity(jd_vec, other_vecs[i]));
    }

    return similarities
}


export const get_length = (vec1, vec2) => {
    // Get length of projection of vec2 onto vec1
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    if(typeof vec2 =="undefined" || typeof vec1 == "undefined" || vec1.length != vec2.length) {
        return 0;
    }

    for (let i = 0; i < vec1.length; i++) {
        dotProduct += vec1[i] * vec2[i];
        magnitude1 += vec1[i] ** 2;
        magnitude2 += vec2[i] ** 2;
    }

    return dotProduct / Math.sqrt(magnitude1);
}
