<script>
    import Project from '$lib/project.svelte';
    import { jd_scores } from '$lib/stores.js';
    import { localStore } from '$lib/data_store.js';
	import { onMount } from 'svelte';
    import Resume from '$lib/resume.svelte';
    // Define a variable to store the user input
    let inputValue = '';

    let app_data_init = {
        projects : []
    }

    let app_data = localStore('app_data', app_data_init);


    // Define a function to handle the form submission
    async function handleSubmit() {
        // Call the backend function using fetch()
        const response = await fetch('/api/embed', {
        method: 'POST',
        body: JSON.stringify({ input: inputValue }),
        headers: {
            'content-type': 'application/json'
        }
        });
        // Get the response data as JSON
        const data = await response.json();
        // Log the response data to the console
        $jd_scores = data.data[0].embedding;
    }

    function add_project() {
        let id = Math.random().toString(36).substr(2, 9);
        $app_data.projects.push({
            name : "Project Name",
            id:  id,
            date : "YYYY-MM-DD",
            lines : [
                {
                    text : "Project description 1.",
                    toggled: true
                },
                {
                    text : "Project description line 2.",
                    toggled: true

                },
                {
                    text : "More stuff...",
                    toggled: true
                }
            ],
            scores : []
        });

        $app_data = $app_data;
    }

    function remove_project(project_data) {
        $app_data.projects = $app_data.projects.filter((project) => {
            return project.id != project_data.id;
        });

        $app_data = $app_data;
    }

    // let id = '39320382';
    
    // onMount(async () => {
    // });
</script>

<div class="flex">
    <div class="left">
        <label for="input">Enter some text:</label>
        <input type="text" id="input" bind:value={inputValue} />
        <button on:click={handleSubmit}>Submit</button>
    
    
        {#if typeof $app_data != 'undefined' && $app_data.projects != 'undefined'}
            {#each $app_data.projects as project_data}
                <Project bind:project_data={project_data} />
                <button on:click={remove_project(project_data)}>Remove</button>
            {/each}
        {/if}
    
        <button on:click={add_project}>+</button>
    
    </div>
    
    <!-- <div class="right">
        <Resume project_data={$app_data.projects} />
    </div> -->
</div>



<style>
    .flex {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    
    
    .right {
        width: 8.5in;
    }

    .left {
        flex-grow:1;
    }
</style>