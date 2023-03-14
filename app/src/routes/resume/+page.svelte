<script>
    import Resume from "$lib/resume_2.svelte";
    import { onMount } from "svelte";
    // On mount open print dialog
    onMount(() => {
        window.print();
    });
</script>

<Resume />
