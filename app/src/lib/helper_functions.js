// Write a function that will take in two vectors and return their cosine similarity.
// The cosine similarity is the dot product of the two vectors divided by the product of the magnitudes of the two vectors.

export function cosine_similarity(vector1, vector2) {
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    
    for (let i = 0; i < vector1.length; i++) {
        dotProduct += vector1[i] * vector2[i];
        magnitude1 += vector1[i] ** 2;
        magnitude2 += vector2[i] ** 2;
    }
    
    return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
}
