<script>
  const CELL_SIZE = 60

  let snake_body = [
    { x: 4, y: 4 },
    { x: 3, y: 3 },
    { x: 2, y: 2 }
  ]

  let board_dimensions = { x: 5, y: 5 }
</script>

<style>
  .body-part {
    position: absolute;
    background-color: green;
    width: 60px;
    height: 60px;
  }
</style>

{#each snake_body as body_part}
  <div
    class="body-part"
    style="left: {body_part.x * CELL_SIZE}px; top: {body_part.y * CELL_SIZE}px" />
{/each}
