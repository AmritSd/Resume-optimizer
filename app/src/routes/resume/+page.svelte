<script>
    import Resume from "$lib/resume.svelte";
    import { onMount } from "svelte";
    import { localStore } from "$lib/data_store.js";
    let app_data_init = {
        projects : [],
        skills : [],
        objective : {
            name : "",
            include : true,
            id : "",
            lines : [
                {
                    text : "",
                    toggled: true,
                    include: true,
                }
            ],
        },
        additional_courses : []
    }   

    let app_data = localStore('app_data_8', app_data_init);

    // On mount open print dialog
    onMount(() => {
        window.print();
    });
</script>

<Resume project_data={$app_data?.projects} skill_data={$app_data?.skills} objective_data={$app_data?.objective} additional_courses={$app_data?.additional_courses} font_size={$app_data?.font_size} font_size_small={$app_data?.font_size_small}/>
