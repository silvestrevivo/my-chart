<script lang="ts">
  import { MyChart } from "$lib/index";

  // The Chart has fixed height and width with 10 units per axis

  const data: MyChart["$$prop_def"]["data"] = [
    { x: 1, y: 4 },
    { x: 2, y: 5 },
    { x: 3, y: 7 },
    { x: 4, y: 8 },
    { x: 5, y: 6 },
    { x: 6, y: 9 },
    { x: 7, y: 5 },
    { x: 8, y: 3 },
  ];

  // The scope should be included inside the area of the chart

  const scope: MyChart["$$prop_def"]["scope"] = {
    minX: 2,
    maxX: 7,
    minY: 3,
    maxY: 7,
  };

  /*
   * The chart is lockable by default, but can be unlocked by setting the
   * `isLockable` prop to false.
   *
   * The chart has no labels by default, but can be added by setting the
   * `hasLabel` prop to true.
   */
</script>

<main>
  <MyChart {data} {scope} isLockable hasLabel />
</main>
