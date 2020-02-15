<script>
  const CELL_SIZE = 60

  let snake_body = [
    { x: 4, y: 4 },
    { x: 3, y: 3 },
    { x: 2, y: 2 }
  ]

  let apple_position = { x: 1, y: 1 }

  let board_dimensions = { x: 5, y: 5 }
</script>

<style>
  .body-part,
  .apple {
    position: absolute;
    width: 60px;
    height: 60px;
    text-align: center;
  }

  .body-part {
    background-color: green;
  }

  .apple {
    font-size: 48px;
  }
</style>

<div>
  {#each snake_body as body_part}
    <div
      class="body-part"
      style="left: {body_part.x * CELL_SIZE}px; top: {body_part.y * CELL_SIZE}px" />
  {/each}

  <div
    style="left: {apple_position.x * CELL_SIZE}px; top: {apple_position.y * CELL_SIZE}px"
    class="apple">
    🍎
  </div>
</div>
