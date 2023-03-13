<script>
    export let project_data = {};
	export let skill_data = {};
	export let objective_data = {};
	export let additional_courses = [];
	export let font_size = "1rem";
	export let font_size_small = "0.9rem";
</script>



<div class="container" style="--f-size: {font_size}; --f-size-small: {font_size_small};">
	<!-- Introduction section -->
	<div class="section">
		<div class="section-header">
			<div class="prose prose-2xl hero-name">Amrit Sandhu</div>
			<div class="contact-info">
				<div class="chip">
					<i class="fas fa-envelope" />
					amrits@utexas.edu
				</div>
				<div class="chip">
					<i class="fas fa-phone" />
					512-781-4002
				</div>
				<!-- <div class="chip">
					<i class="fas fa-map-marker-alt" />
					Austin, Tx
				</div> -->
			</div>
		</div>

		{#if typeof objective_data != 'undefined' && objective_data?.bullets != 'undefined' && objective_data?.master_include === true}
			<div class="section-content">
				<div class="objective">
					{#each objective_data?.bullets as line, ind}
						{#if line}
							<p>{line}</p>
						{/if}
					{/each}
				</div>
			</div>
		{/if}

	</div>

	<div class="section">
		<div class="section-header prose prose-2xl"><mark>Education</mark></div>
        <hr />
		<div class="section-content">
			<div class="education-entry">
				<div>
					<div class="education-title">University of Texas at Austin</div>
					<div class="education-subtitle">
						Masters of Science in Business Analytics, Financial Analytics track
					</div>
					<div class="education-gpa">GPA: 4.0/4.0</div>
				</div>
				<div class="education-date">May 2023</div>
			</div>

			<div class="education-entry">
				<div>
					<div class="education-title">Texas A&M University</div>
					<div class="education-subtitle">
						Bachelors of Science in Computer Science, Minor in Economics
					</div>
					<div class="education-gpa">GPA: 4.0/4.0 and University Honors</div>
				</div>
				<div class="education-date">May 2022</div>
			</div>
		</div>
	</div>

    	<!-- Skills and programming languages section -->
	<div class="section">
		<div class="section-header prose prose-2xl"><mark>Skills and Programming Languages</mark></div>
        <hr />
		<div class="section-content">
			<ul class="mx-4 my-1 skills-list">
				{#each skill_data as skill_group}
					{#if skill_group?.master_include}
						<li class="list-disc">
							<span class="skills-list-title">{skill_group?.name}</span> 
							<span class="skills-list-body">
								{#each skill_group?.bullets as skill, ind}
									{skill}{#if (skill_group?.bullets?.length - 1) != ind},&nbsp;{/if}
								{/each}
							</span>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
	</div>


	<!-- Work experience section -->
	<div class="section">
		<div class="section-header prose prose-2xl"><mark>Work Experience</mark></div>
        <hr />
		<div class="section-content">
			<div class="work-entry">
				<div class="work-title">Anunta Tech</div>
				<div class="work-date">July 2021 - Dec 2021</div>
			</div>
			<div class="work-subtitle">Technology Intern</div>
			<div class="work-description">
                <ul class="mx-4 my-2">
                    <li class="list-disc">Worked on an experimental feature to predict problems with Virtual Machines using diagnostic data.</li>
                    <li class="list-disc">Processed the data using unsupervised machine learning using the Azure anomaly detection REST API.</li>
                    <li class="list-disc">The program will be integrated into their flagship Euvantage client monitoring software.</li>
                </ul>
			</div>
		</div>
	</div>

	<!-- Projects section -->
	<div class="section">
		<div class="section-header prose prose-2xl"><mark>Projects</mark></div>
        <hr />
		<div class="section-content">
            {#each project_data as project}
				{#if project?.master_include}
					<div class="project-header">
						<div class="project-title">{project.name}</div>
						<div class="project-date">{project.date}</div>
					</div>

					{#if project.subtitle}
						<div class="project-subtitle">{project.subtitle}</div>
					{/if}

					<div class="project-description">
						{#if project.description}<p>{project.description}</p>{/if}
						{#if project.bullets}
							<ul class="mx-4 my-2">
								{#each project.bullets as bullet}
									<li class="list-disc">{bullet}</li>
								{/each}
							</ul>
						{/if}
					</div>
				{/if}
            {/each}
		</div>
	</div>


	<!-- Additional courses section -->
	
	{#if additional_courses?.length > 0 && additional_courses.some(project => project?.master_include) == true}
		<div class="section">
			<div class="section-header prose prose-2xl"><mark>Relevant Coursework</mark></div>
			<hr />
			<div class="section-content">
				{#each additional_courses as project}
				{#if project?.master_include}
					{#if project.name != "" || project.date != ""}
						<div class="project-header">
							<div class="project-title">{project.name}</div>
							<div class="project-date">{project.date}</div>
						</div>
					{/if}

					{#if project.subtitle}
						<div class="project-subtitle">{project.subtitle}</div>
					{/if}

					<div class="project-description">
						{#if project.description}<p>{project.description}</p>{/if}
						{#if project.bullets}
							<ul class="mx-4 my-2">
								{#each project.bullets as bullet}
									<li class="list-disc">{bullet}</li>
								{/each}
							</ul>
						{/if}
					</div>
				{/if}
			{/each}
			</div>
		</div>
	{/if}

	<!-- Work eligibility section -->
	<!-- <div class="section">
		<div class="section-header prose prose-2xl"><mark>Work Eligibility</mark></div>
		<div class="section-content project-description">
			Eligible to work in the United States with no restrictions
		</div>
	</div> -->
</div>

<style>
	/* Add your CSS styles here */
    @page {
        margin: 0.5rem;
		margin-top: 1rem;
		margin-bottom: 0rem;
    }
	@media print {
		.container {
			max-width: 100% !important;
			padding: 0rem 0.5rem !important;
		}

		.prose.prose-2xl.prose.prose-2xl.hero-name {
			font-size: 2rem !important;
		} 
		.container::before {
			border: none !important;
		}
	}
	.container {
		--f-size: 1rem;
		--f-size-small: 0.9rem;
		max-width: calc(8.5in - 1rem);
		margin: 0 auto;
		padding: 0rem 0.5rem;
		text-align: left;
        /* Georgia */
        /* font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; */
		/* font family calibri */
		font-family: 'Calibri', sans-serif;
		font-size: var(--f-size);
		position: relative;

	}

	.container::before{
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 8.5in;
		height: calc(11in - 1rem);
		border-bottom: 2px solid red;
		z-index: -1;
	}
	.section {
		margin-bottom: 15px;
	}

    hr {
        display: block;
        height: 1px;
        border: 0;
        border-top: 1px solid #ccc; 
        padding: 0;
        margin: 0.2rem 0;
    }

	mark {
		margin: 0 -0.4em;
		padding: 0.1em 0.4em;
		border-radius: 0.8em 0.3em;
		background: transparent;
		background-image: linear-gradient(
			to right,
			rgba(0, 102, 255, 0.1),
			rgba(172, 208, 255, 0.5) 4%,
			rgba(201, 223, 252, 0.4) 96%
		);
		-webkit-box-decoration-break: clone;
		box-decoration-break: clone;
		color: #224444;
	}
	.prose.prose-2xl {
		font-size: 1.125rem;
	}

	.prose.prose-2xl.hero-name {
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: 0.05rem;
		font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
		color: #336666;
		flex-shrink: 0;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.contact-info {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		row-gap: 10px;
	}
	.contact-info .chip {
		display: flex;
		align-items: center;
		background-color: #fad7b7;
		border-radius: 16px;
		padding: 5px 12px;
		font-size: var(--f-size-small);
		font-weight: 400;
		line-height: 1.25;
		margin-right: 10px;
		margin-top: 0px;
		letter-spacing: 1px;
		flex-shrink: 0;
	}
	.contact-info i {
		margin-right: 5px;
	}

	.objective {
		margin-top: 0.5rem;
		font-size:var(--f-size-small);
        font-size: 11pt;
		font-weight: 400;
	}

	.education-entry {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.education-title,
	.work-title {
		font-weight: 550;
		margin-bottom: 2px;
		flex-grow: 1;
	}
	.education-subtitle {
		font-size:var(--f-size-small);
		font-weight: 400;
	}
	.education-gpa {
		font-size:var(--f-size-small);
		font-weight: 400;
		color: grey;
	}
	.education-date {
		font-size:var(--f-size-small);
		font-weight: 400;
		color: grey;
		text-align: right;
	}

	.work-entry {
		display: flex;
		justify-content: space-between;
	}
	.work-subtitle {
		font-size:var(--f-size-small);
		font-weight: 400;
		margin-bottom: 2px;
		color: grey;
	}
	.work-date {
		font-size:var(--f-size-small);
		font-weight: 400;
		color: grey;
		text-align: right;
		flex-grow: 1;
		/* flex-shrink: 0; */
	}
	.work-description {
		font-size:var(--f-size-small);
		font-weight: 400;
		margin-top: 5px;
	}

	.project-header {
		display: flex; 
		justify-content: space-between;
  }

	.project-title {
		font-weight: 550;
		margin-bottom: 2px;
		flex-grow: 1;
	}
	.project-date {
		font-size:var(--f-size-small);
		font-weight: 400;
		color: grey;
		flex-grow: 1;
		text-align: right;
	}

	.project-subtitle {
		font-size:var(--f-size-small);
		font-weight: 400;
		margin-bottom: 2px;
		color: grey;
	}
	.project-description {
		font-size:var(--f-size-small);
		font-weight: 400;
		/* margin-top: 5px; */
		margin-bottom: 1rem;
	}

	.skills-list {
		font-size:var(--f-size-small);
	}

	.skills-list-body{
		font-size:var(--f-size-small);
		font-weight: 400;
		margin-bottom: 2px;
		color: grey;
	}

	.skills-list-title {
		/* font-weight: 500; */
		margin-bottom: 2px;
		font-size:var(--f-size-small);
		color: black;
	}

    ul {
        display: block;
        list-style-type: disc;
        margin-block-start: 0.2em;
        margin-block-end: 0.1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 1rem;
    }
    p{
        margin: 0;
    }

</style>


