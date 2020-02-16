<script>
  let scores = [
    { id: 1, score: 40, name: "Foo" },
    { id: 2, score: 38, name: "Foo" },
    { id: 3, score: 35, name: "Foo" },
    { id: 4, score: 30, name: "Foo" },
    { id: 5, score: 24, name: "Foo" },
    { id: 6, score: 19, name: "Foo" },
    { id: 7, score: 17, name: "Foo" },
    { id: 8, score: 11, name: "Foo" },
    { id: 9, score: 4, name: "Foo" },
    { id: 10, score: 1, name: "Foo" },
  ]
</script>

<style>
  .the-list {
    display: grid;
    grid-template-columns: 3rem repeat(2, auto);
  }
</style>

<div class="the-list">
  {#each scores as score, index (score.id)}
    <div>{index + 1}</div>
    <div>{score.name}</div>
    <div>{score.score}</div>
  {/each}
</div>
