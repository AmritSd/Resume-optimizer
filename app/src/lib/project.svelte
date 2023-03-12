<script>
    import { onMount } from 'svelte';
    import { jd_scores } from '$lib/stores.js';
    import { cosine_similarity } from '$lib/helper_functions.js'

    // random string 10 char long
    export let project_data = {};


    let similarities = [];
    let lines = project_data.lines;
    let updating = false;

    function get_text(lines) {
        return lines.map((line) => {
            return line.text;
        });
    }

    async function embed(data) {
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

    const get_similarities = (jd_vec, other_vecs) => {

        if(jd_vec.length == 0) {
            return [];
        }

        let similarities = [];

        for(let i = 0; i < other_vecs.length; i++) {
            similarities.push(cosine_similarity(jd_vec, other_vecs[i]));
        }

        return similarities
    }

    const update_scores = async (lines) => {
        if(!updating) {
            updating = true;
            await new Promise(r => setTimeout(r, 1000));
            project_data.lines = lines;
            // Write await embed(project_data) to project_data.lines.scores
            let scores = await embed(project_data);
            project_data.lines.forEach((line, i) => {
                line.scores = scores[i];
            });
            project_data = project_data;
            updating = false;
            await new Promise(r => setTimeout(r, 1000));
            project_data.lines = lines;
            scores = await embed(project_data);
            project_data.lines.forEach((line, i) => {
                line.scores = scores[i];
            });
            project_data = project_data;
        }
    }

    const update_description_and_bullets = (lines) => {
        let description = [];
        let bullets = [];
        for(let i = 0; i < lines.length; i++) {
            if(lines[i].toggled) {
                bullets.push(lines[i]);
            } else {
                description.push(lines[i]);
            }
        }

        // Concat description to a single string
        description = description.join(' ');

        project_data.description = description;
        project_data.bullets = bullets;
    }

    // Define an array of data to display in the grid
    let rows = [
      { id: 1, name: 'John Smith', date: '2022-01-01', checked: false },
      { id: 2, name: 'Jane Doe', date: '2022-02-01', checked: false },
      { id: 3, name: 'Bob Johnson', date: '2022-03-01', checked: false },
    ];
  
    // Define a function to delete a row by ID
    function deleteRow(row_to_delete) {
       rows = rows.filter(row => row !== row_to_delete);
    }
    
    onMount(async () => {
        // If scores are not empty, then don't embed
        // If any line in project_data.lines does not have a score, then embed
        let embed_now = false;
        for(let i = 0; i < project_data.lines.length; i++) {
            if(typeof project_data.lines[i].scores === 'undefined' || project_data.lines[i].scores.length == 0) {
                embed_now = true;
                break;
            }
        }
        if(embed_now) {
            let scores = await embed(project_data);
            project_data.lines.forEach((line, i) => {
                line.scores = scores[i];
            });
        }
    });

    $: update_scores(lines);

    $: similarities = get_similarities($jd_scores, project_data.lines.map((line) => line.scores));

    $: update_description_and_bullets(lines);
</script>

<!-- Pretty print data -->
<h2 contenteditable="true" bind:textContent={project_data.name} />
<h3 contenteditable="true" bind:textContent={project_data.date} />
{#each lines as line}
    <p contenteditable="true" bind:textContent={line.text} />
    <input type="checkbox" bind:checked={line.toggled} />
{/each}


<!-- Show similarities -->
{#each similarities as similarity}
    <p>{similarity}</p>
{/each}





  
  <div class="my-grid">
    <div class="my-grid__delete"></div>
    <div class="my-grid__name-date">
        <h2 contenteditable="true" bind:textContent={project_data.name} />
        <h3 contenteditable="true" bind:textContent={project_data.date} />
    </div>
    <div class="my-grid__empty"></div>
    <div class="my-grid__empty"></div>
    <div class="my-grid__empty"></div>
  
    {#each rows as row}
      <div class="my-grid__row">
        <div class="my-grid__delete">
          <input type="checkbox" on:change={() => deleteRow(row)} />
        </div>
        <div class="my-grid__name-date">{row.name} ({row.date})</div>
        <div class="my-grid__checkboxes">
          <input type="checkbox" bind:checked={row.checked} />
        </div>
        <div class="my-grid__empty"></div>
        <div class="my-grid__empty"></div>
        <div class="my-grid__empty"></div>
      </div>
    {/each}

    <div class="my-grid__row">
        <div class="my-grid__name-date">
            <button on:click={
                () => {
                    rows.push({
                    id: rows.length + 1,
                    name: 'New Row',
                    date: '2022-01-01',
                    checked: false
                    });
                    rows = rows;
            }}>+</button>
        </div>
      </div>
  </div>



<!-- MyGrid.css -->
<style>

    h2 {
        display: inline;
        margin-right: 3rem;
    }
    h3 {
        display: inline;
    }
    .my-grid {
      display: grid;
      grid-template-columns: 1rem 1fr 1rem 1rem 1rem 1rem;
      grid-gap: 10px;
      border: 1px solid grey; /* Add a grey border around the grid */
    }
  
    .my-grid__delete {
      grid-column: 1;
    }
  
    .my-grid__name-date {
      grid-column: 2;
      grid-row: 1;
    }
  
    .my-grid__checkboxes {
      grid-column: 3;
    }
  
    .my-grid__empty {
      grid-column: 4;
    }
  
    .my-grid__row {
      display: grid;
      grid-template-columns: 1rem 1fr 1rem 1rem 1rem 1rem;
      grid-gap: 10px;
      border-top: 1px solid grey; /* Add a grey top border to each row */
      /* span entirerow */
      grid-column: 1 / -1;
    }
  
    .my-grid__row:first-child {
      border-top: none; /* Remove the top border from the first row */
    }
  
    .my-grid__row:last-child {
      border-bottom: 1px solid grey; /* Add a grey bottom border to the last row */
    }
  
    .my-grid__row input[type="checkbox"] {
      margin-top: 5px; /* Add some margin to the checkboxes */
    }
</style>
