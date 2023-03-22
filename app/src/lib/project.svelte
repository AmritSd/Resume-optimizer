<script>
    import { onMount } from 'svelte';
    import { jd_scores } from '$lib/stores.js';
    import { embed, get_text, get_similarities, get_length } from '$lib/project_helpers.js'
    import { flip } from 'svelte/animate';
    import { dndzone } from 'svelte-dnd-action';

    // random string 10 char long
    export let project_data = {};
    export let delete_func = () => {};

    let lines = project_data.lines;
    let updating = false;
    let sims = [];
    let final_angle;
    let final_length;
    const flipDurationMs = 200;

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
            if(lines[i].include) {
                if(lines[i].toggled) {
                    bullets.push(lines[i].text);
                } else {
                    description.push(lines[i].text);
                }
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
    

    function handle_consider(e) {
        lines = e.detail.items;
    }

    function handle_finalize(e) {
        lines = e.detail.items;
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

        if(lines.some(x => !x.id)) {
                lines = lines.map((line) => {
                    if(!line.id) {
                        line.id = Math.random().toString(20);
                    }
                    return line;
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

    $: (
        (j_s, p_d) => {
            let scores = project_data.lines.map((line) => line.scores);
            // If any score is undefined, then return
            if(scores.some((score) => typeof score === 'undefined')) {
                return;
            }
            // Sum up all the scores using element-wise addition
            let sum = scores.reduce((a, b) => a.map((x, i) => x + b[i]));
            final_angle = get_similarities(j_s, [sum])[0];

            // Get length of sum in direction of jd_scores
            final_length = get_length(j_s, sum);

        }
    )($jd_scores, project_data);

    $: update_description_and_bullets(lines);

    // $: console.log($jd_scores);
</script>

  
<div class="my-grid">
<div class="my-grid__delete">
    <button on:click={delete_func} id={project_data.id + 'delete'} />
</div>
<div class="my-grid__name-date">
    <h3 class="child" contenteditable="true" bind:textContent={project_data.name} />
    <h4 class="child" contenteditable="true" bind:textContent={project_data.date} />
</div>
<div class="my-grid__checkboxes-include">
    <input type="checkbox" bind:checked={project_data.master_include} id={project_data.id + 'master-include'}/>
    <label class="empty-label-3" for={project_data.id + 'master-include'}></label>
</div>

<div class="my-grid__drag-box">
    <div class="my-grid__drag-handle">
        <img src="/draggable.svg" alt="drag icon"/>
    </div>
</div>

<div class="my-grid__top-corner">
    {(typeof final_length != "undefined") ? final_length.toFixed(2) : '-'}
</div>

<div class="my-grid__status" >
    {(typeof final_angle != "undefined") ? final_angle.toFixed(2) : '-'}
</div>

{#if !lines.some(x => !x.id)}
    <section use:dndzone="{{items: lines, flipDurationMs, type: "row"}}"  on:finalize={handle_finalize}>
        {#each lines as row, ind (row.id)}
            <div class="my-grid__row data-row" animate:flip="{{duration: flipDurationMs}}">
                <div class="my-grid__delete">
                    <button on:click={() => {deleteRow(row)}} id={row.id + 'delete' + project_data.id} />
                </div>
                <div class="my-grid__name-date">
                    <div class="child" contenteditable="true" bind:textContent={row.text} />
                </div>
                <div class="my-grid__checkboxes-include">
                    <input type="checkbox" bind:checked={row.include} id={row.id + 'include' + project_data.id}/>
                    <label class="empty-label-2" for={row.id + 'include' + project_data.id}></label>
                </div>
                <div class="my-grid__checkboxes">
                    <input type="checkbox" bind:checked={row.toggled} id={row.id + project_data.id}/>
                    <label class="empty-label" for={row.id + project_data.id}></label>
                </div>
                <div class="my-grid__empty">{(typeof sims[ind] != "undefined") ? sims[ind].toFixed(2) : '-'}</div>
            </div>
        {/each}
    </section>
{/if}

<div class="my-grid__row">
    <div class="my-grid__name-date center">
        <button on:click={
            () => {
                project_data.lines.push({
                toggled: true,
                text: "New line",
                id :  Math.random().toString(36).substr(2, 9)
                });
                project_data = project_data;
        }}>+</button>
    </div>
    </div>
  </div>



<!-- MyGrid.css -->
<style>
    
    .empty-label, .empty-label-2, .empty-label-3 {
        width: 100%;
        height: 100%;
        display: block;
        background-color: whitesmoke;
    }
    label:hover {
        cursor: pointer;
    }
    input[type=checkbox]{
        display: none;
    }

    input[type=checkbox]:checked + .empty-label{
        background-color: paleturquoise;
    }

    input[type=checkbox]:checked + .empty-label-2{
        background-color: palegoldenrod;
    }

    input[type=checkbox]:checked + .empty-label-3{
        background-color: palegreen;
    }
    .my-grid__delete button:hover {
        background-color: salmon;
        cursor: pointer;
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
      grid-template-columns: 1.6rem 1fr 1.5rem 1.5rem 3rem 1rem 3rem;
      border: 5px solid transparent; /* Add a grey border around the grid */
      /* gerogia font */
      font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
      cursor: default;
    }
  
    .my-grid__delete {
      grid-column: 1;
    }
  
    .my-grid__name-date {
      grid-column: 2;
      grid-row: 1;
      display: flex;
      align-items: center;
      justify-content: stretch;
      /* margin-right: 0.5rem solid transparent; */
    }

    .my-grid__name-date .child {
        margin-right: 0.5rem;
        height: 100%;
        display: flex;
        align-items: center;
        min-width: 1rem;
        cursor: text;
    }

    .my-grid__name-date .child:focus {
        background-color: palegoldenrod;
        outline: 0px solid transparent;
    }



    .my-grid__name-date.center {
        justify-content: center;
    }

    .my-grid__drag-box {
        grid-column: 5;
        cursor: move;
        display: flex;
        align-items: center;
        justify-content: center;
    }


    .my-grid__top-corner {
        grid-column: 7;
        grid-row: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        background-color:black;
    }

    .my-grid__status{
        grid-column: 7;
        grid-row: 2;
        background-color: grey;
        margin-top: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .my-grid__name-date.center button {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        border: none;
        background-color: whitesmoke;
        color: grey;
    }

    .my-grid__name-date.center button:hover {
        background-color: palegreen;
        color: grey;
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
      cursor: move;
    }
  
    .my-grid__row {
      display: grid;
      grid-template-columns: 1.6rem 1fr 1.5rem 1.5rem 3rem 1rem;
      border-bottom: 5px solid transparent; /* Add a grey top border to each row */
      /* span entirerow */
      grid-column: 1 / -2;
      min-height: 1.5rem;
      grid-template-rows: max(1.5rem, min-content);
    }
  
    .my-grid__row.data-row:hover {
        background-color: #f5f5f5;
    }
    section {
        grid-column: 1 / -2;
        border-top: 5px solid transparent; /* Add a grey top border to each row */

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
