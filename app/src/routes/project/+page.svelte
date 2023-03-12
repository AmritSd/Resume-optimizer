
<!-- MyGrid.svelte -->
<script>
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
</script>
  
  <div class="my-grid">
    <div class="my-grid__delete"></div>
    <div class="my-grid__name-date">Name and Date</div>
    <div class="my-grid__checkboxes">Checkboxes</div>
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
