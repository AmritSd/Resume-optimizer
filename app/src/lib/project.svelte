<script>
    import { onMount } from 'svelte';
    import { jd_scores } from '$lib/stores.js';
    import { embed, get_text, get_similarities} from '$lib/project_helpers.js'
    // random string 10 char long
    export let project_data = {};


    let lines = project_data.lines;
    let updating = false;
    let sims = [];

    const update_scores = async (lines) => {
        if(!updating) {
            updating = true;
            // For rate-limiting ...
            await new Promise(r => setTimeout(r, 1000));

            // Update project_data.lines
            project_data.lines = lines;

            // Update scores
            let scores = await embed(project_data);
            project_data.lines.forEach((line, i) => {
                line.scores = scores[i];
            });
            project_data = project_data;

            updating = false;

            // Do again to get last line
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
        console.log("here");
        let description = [];
        let bullets = [];
        for(let i = 0; i < lines.length; i++) {
            if(lines[i].toggled) {
                bullets.push(lines[i].text);
            } else {
                description.push(lines[i].text);
            }
        }

        // Concat description to a single string
        description = description.join(' ');

        project_data.description = description;
        project_data.bullets = bullets;
        project_data = project_data;
    }

  
    // Define a function to delete a row by ID
    function deleteRow(row_to_delete) {
       project_data.lines = project_data.lines.filter(row => row !== row_to_delete);
       project_data = project_data;
       lines = project_data.lines;
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

    $: (
        (j_s, p_d) => {
            let similarities = get_similarities(j_s, project_data.lines.map((line) => line.scores));
            project_data.lines.forEach((line, i) => {
                line.similarities = similarities[i];
            });
            sims = similarities;
        }
    )($jd_scores, project_data);

    $: update_description_and_bullets(lines);
</script>

  
<div class="my-grid">
<div class="my-grid__delete"></div>
<div class="my-grid__name-date">
    <h3 contenteditable="true" bind:textContent={project_data.name} />
    <h4 contenteditable="true" bind:textContent={project_data.date} />
</div>


{#each lines as row, ind}
    <div class="my-grid__row">
    <div class="my-grid__delete">
        <button on:click={() => {deleteRow(row)}} id={ind + 'delete' + project_data.id} />
    </div>
    <div class="my-grid__name-date" contenteditable="true" bind:textContent={row.text} />
    <div class="my-grid__checkboxes-include">
        <input type="checkbox" bind:checked={row.include} id={ind + 'include' + project_data.id}/>
        <label class="empty-label-2" for={ind + 'include' + project_data.id}></label>
    </div>
    <div class="my-grid__checkboxes">
        <input type="checkbox" bind:checked={row.toggled} id={ind + project_data.id}/>
        <label class="empty-label" for={ind + project_data.id}></label>
    </div>
    <div class="my-grid__empty">{(typeof sims[ind] != "undefined") ? sims[ind].toFixed(2) : '-'}</div>
    </div>
{/each}

<div class="my-grid__row">
    <div class="my-grid__name-date">
        <button on:click={
            () => {
                project_data.lines.push({
                toggled: true,
                text: "New line"
                });
                project_data = project_data;
        }}>+</button>
    </div>
    </div>
  </div>



<!-- MyGrid.css -->
<style>
    .empty-label, .empty-label-2 {
        width: 100%;
        height: 100%;
        display: block;
        background-color: whitesmoke;
    }
    input[type=checkbox]{
        display: none;
    }

    input[type=checkbox]:checked + .empty-label{
        background-color: paleturquoise;
    }

    input[type=checkbox]:checked + .empty-label-2{
        background-color: palegreen;
    }

    .my-grid__delete button:hover {
        background-color: salmon;
    }
    .my-grid__delete button {
        width: calc(100% - 0.5rem);
        height: 100%;
        display: block;
        background-color: whitesmoke;
        border: none;

    }





    h3 {
        margin: 0;
        margin-right: 3rem;
    }
    h4 {
        margin: 0;
    }
    .my-grid {
      display: grid;
      grid-template-columns: 1rem 1fr 1rem 1rem 1rem 1rem;
      border: 5px solid transparent; /* Add a grey border around the grid */
    }
  
    .my-grid__delete {
      grid-column: 1;
    }
  
    .my-grid__name-date {
      grid-column: 2;
      grid-row: 1;
      display: flex;
      align-items: center;
    }

    .my-grid__checkboxes-include {
      grid-column: 3;
    }
  
    .my-grid__checkboxes {
      grid-column: 4;
    }
  
    .my-grid__empty {
      grid-column: 5;
      text-align: center;
    }
  
    .my-grid__row {
      display: grid;
      grid-template-columns: 1.6rem 1fr 1.5rem 1.5rem 3rem 2rem 1rem;
      border-top: 5px solid transparent; /* Add a grey top border to each row */
      /* span entirerow */
      grid-column: 1 / -1;
      height: 1.5rem;
      grid-template-rows: 1.5rem;
    }
  
    .my-grid__row:first-child {
      border-top: none; /* Remove the top border from the first row */
    }
  
    .my-grid__row:last-child {
      border-bottom: 1px solid transparent; /* Add a grey bottom border to the last row */
    }
  
    .my-grid__row input[type="checkbox"] {
      margin-top: 5px; /* Add some margin to the checkboxes */
    }
</style>
