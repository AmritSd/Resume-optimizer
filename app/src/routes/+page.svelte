<script>
    import Project from '$lib/project.svelte';
    import { jd_scores } from '$lib/stores.js';
    import { app_data } from '$lib/data_store.js';
	import { onMount } from 'svelte';
    import Resume from '$lib/resume_2.svelte';
    // Define a variable to store the user input
    let inputValue = '';
    let export_file_name = '';

    // Define a function to handle the form submission
    async function handleSubmit() {
        console.log(inputValue);
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

    function add_skills() {
        let id = Math.random().toString(36).substr(2, 9);
        $app_data.skills.push({
            name : "Skill heading",
            id:  id,
            date : "",
            master_include : true,
            lines : [
                {
                    text : "Skill 1",
                    toggled: true,
                    include: true,
                },
                {
                    text : "Skill 2",
                    toggled: true,
                    include: true,

                },
                {
                    text : "Skill 3",
                    toggled: true,
                    include: true,
                }
            ],
            scores : []
        });

        $app_data = $app_data;
    }

    function add_project() {
        let id = Math.random().toString(36).substr(2, 9);
        $app_data.projects.push({
            name : "Project Name",
            id:  id,
            date : "YYYY-MM-DD",
            master_include : true,
            lines : [
                {
                    text : "Project description 1.",
                    toggled: true,
                    include: true,
                },
                {
                    text : "Project description line 2.",
                    toggled: true,
                    include: true,

                },
                {
                    text : "More stuff...",
                    toggled: true,
                    include: true,
                }
            ],
            scores : []
        });

        $app_data = $app_data;
    }

    function add_course () {
        let id = Math.random().toString(36).substr(2, 9);
        $app_data.additional_courses.push({
            name : "",
            id:  id,
            date : "",
            master_include : true,
            lines : [
                {
                    text : "Course 1",
                    toggled: true,
                    include: true,
                },
                {
                    text : "Course 2",
                    toggled: true,
                    include: true,

                },
                {
                    text : "Course 3",
                    toggled: true,
                    include: true,
                }
            ],
            scores : []
        });

        $app_data = $app_data;
    }

    function add_work() {
        let id = Math.random().toString(36).substr(2, 9);
        $app_data.work_data.push({
            name : "Company Name",
            id:  id,
            date : "YYYY-MM-DD",
            master_include : true,
            lines : [
                {
                    text : "Position",
                    toggled: false,
                    include: true,
                },
                {
                    text : "Work line 1",
                    toggled: true,
                    include: true,

                },
                {
                    text : "Work line 2",
                    toggled: true,
                    include: true,
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

    function remove_skill(skill_data) {
        $app_data.skills = $app_data.skills.filter((skill) => {
            return skill.id != skill_data.id;
        });

        $app_data = $app_data;
    }

    function remove_additional_course(project_data) {
        $app_data.additional_courses = $app_data.additional_courses.filter((project) => {
            return project.id != project_data.id;
        });

        $app_data = $app_data;
    }

    function remove_work_data(work_data) {
        $app_data.work_data = $app_data.work_data.filter((work) => {
            return work.id != work_data.id;
        });

        $app_data = $app_data;
    }

    function export_data() {
        // Download $app_data as json file with name export_file_name
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify($app_data));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", export_file_name + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function import_data() {
        // Import data from file
        // Show file picker
        var file_reader = new FileReader();
        file_reader.onload = function(e) {
            $app_data = JSON.parse(e.target.result);
            // reload page
            window.location.reload();
        }

        var input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => { 
            // getting a hold of the file reference
            var file = e.target.files[0]; 
            // setting up the reader
            file_reader.readAsText(file);
        }
        input.click();

    }

    onMount(() => {
    });



    // $: console.log($app_data.name);
</script>

<div class="flex">
    <div class="left">
        <h2 class="projects-header">Resume optimizer</h2>
        <form class="jd-form">
            <textarea bind:value={inputValue} placeholder="Job description..."/>
            <button on:click={handleSubmit}>Submit</button>
        </form>

        <h2 class="projects-header">Personal details</h2>
        {#if typeof $app_data != 'undefined' && $app_data.name != 'undefined'} 
            <textarea bind:value={$app_data.name} placeholder="Name" class="personal-details" rows="1" draggable="false"/>
        {/if}

        <h2 class="projects-header">Contact info</h2>
        {#if typeof $app_data != 'undefined' && $app_data.chips != 'undefined'} 
            <Project bind:project_data={$app_data.chips} />
        {/if}
    
        <h2 class="projects-header">Objective</h2>
        {#if typeof $app_data != 'undefined' && $app_data.objective != 'undefined'} 
            <Project bind:project_data={$app_data.objective} />
        {/if}



        <h2 class="projects-header">Skills</h2>
        {#if typeof $app_data != 'undefined' && $app_data.skills != 'undefined'}
            {#each $app_data.skills as skill_data}
                <Project bind:project_data={skill_data} delete_func={() => {remove_skill(skill_data)}}/>
                <!-- <button on:click={remove_project(project_data)}>Remove</button> -->
            {/each}
        {/if}
        <button on:click={add_skills} class="add-project">Add</button>

        <h2 class="projects-header">Work experience</h2>
        {#if typeof $app_data != 'undefined' && $app_data.work_data != 'undefined'}
            {#each $app_data.work_data as project_data}
                <Project bind:project_data={project_data} delete_func={() => {remove_work_data(project_data)}}/>
            {/each}
        {/if}
        <button on:click={add_work} class="add-project">Add</button>

        <h2 class="projects-header">Projects</h2>
        {#if typeof $app_data != 'undefined' && $app_data.projects != 'undefined'}
            {#each $app_data.projects as project_data}
                <Project bind:project_data={project_data} delete_func={() => {remove_project(project_data)}}/>
                <!-- <button on:click={remove_project(project_data)}>Remove</button> -->
            {/each}
        {/if}
    
        <button on:click={add_project} class="add-project">Add</button>
    
        <h2 class="projects-header">Additional courses</h2>
        {#if typeof $app_data != 'undefined' && $app_data.additional_courses != 'undefined'}
            {#each $app_data.additional_courses as project_data}
                <Project bind:project_data={project_data} delete_func={() => {remove_additional_course(project_data)}}/>
            {/each}
        {/if}

        <button on:click={add_course} class="add-project">Add</button>
        
        <br>
        <br>
        <form class="import-export">
            <input type="text" placeholder="Resume name" bind:value={export_file_name}/>&nbsp;
            <button on:click={() => {export_data()}}>Export</button>
            &nbsp;Or&nbsp;
            <button on:click={() => {import_data()}}>Import</button>
        </form>
        
        <br>
        <form class="font-size-form">
            <label for="font-size">Font size</label>
            <input type="number" id="font-size" on:change={(e) => {$app_data.font_size = e.target.value + "pt"; $app_data = $app_data;}} value={$app_data?.font_size.replace("pt", "")}/>
            &nbsp;and&nbsp;
            <label for="font-size-small">Font size small</label>
            <input type="number" id="font-size-small" on:change={(e) => {$app_data.font_size_small = e.target.value + "pt"; $app_data = $app_data;}} value={$app_data?.font_size_small.replace("pt", "")}/>
        </form>
        <br>
        <a href="/resume">Download resume</a>
    </div>
    
    <div class="right">
        <!-- <Resume project_data={$app_data?.projects} skill_data={$app_data?.skills} objective_data={$app_data?.objective} additional_courses={$app_data?.additional_courses} font_size={$app_data?.font_size} font_size_small={$app_data?.font_size_small}/> -->
        <Resume />
    </div>
</div>



<style>
    :global(::-webkit-scrollbar) {
        width: 8px;               /* width of the entire scrollbar */
    }

    :global(::-webkit-scrollbar-track) {
        background: #eee;        /* color of the tracking area */
    }

    :global(::-webkit-scrollbar-thumb) {
    background-color: palegoldenrod;    /* color of the scroll thumb */
    }
    :global(body) {
        overflow: hidden;
    }
    .flex {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    }
    
    
    .right {
        width: 8.8in;
        max-height: 90vh;
        overflow-y: scroll;
    }

    .left {
        max-height: 90vh;
        /* width: 5in; */
        max-width: calc(100vw - 8.5in - 2rem);
        overflow-y: scroll;
        scrollbar-width: thin;
    }

    .jd-form {
        display: flex;
        flex-direction: column;
        align-items: start;
        margin-bottom: 1rem;
        margin-right: 1rem;
    }

    .jd-form textarea {
        width: 100%;
        height: 20rem;
        font: inherit;
        resize: none;
    }
    .jd-form button {
        width: 5rem;
        margin: 0.5rem;
        margin-left: 0;
        border: none;
        padding: 0.5rem 1rem;
    }
    .jd-form button:hover {
        background-color: palegoldenrod;
    }

    .import-export input {
        padding: calc(0.5rem - 2px) 0.5rem;
    }
    .import-export button{
        width: 5rem;
        /* margin: 0rem; */
        margin-left: 0;
        border: none;
        padding: 0.5rem 1rem;
        /*  padding: 0 1rem; */
    }
    .import-export button:hover {
        background-color: palegoldenrod;
    }

    .personal-details {
        width: calc(100% - 1rem);
        font: inherit;
        resize: none;
        padding-bottom: 0.5rem;
        padding-top: 0.5rem;
        padding-left:0.5rem;
        border:none;
        background-color: #eee;
    }
    .add-project {
        margin-top: 1rem;
        margin-bottom: 1rem;
        border: none;
        padding: 0.5rem 1rem;
    }
    .add-project:hover {
        background-color: palegoldenrod;
    }

    h2 {
        font-weight: 500;
    }

    .font-size-form input{
        width: 3rem;
        padding: calc(0.5rem - 2px) 0.5rem;
        border:none;
        background-color: #eee;
    }
    .font-size-form input:hover {
        background-color: palegoldenrod;
    }
</style>