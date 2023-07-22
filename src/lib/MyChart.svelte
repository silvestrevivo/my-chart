<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "$lib/index";
  import {
    getSVGCoordinates,
    drawAxes,
    drawSquare,
    isPointInsideSquare,
    addTextToSVG,
  } from "$utils/chart";
  import { L } from "$modules/localization";
  import type { DataPoint, Scope } from "$types/index";

  // First: define props
  export let data: DataPoint[],
    scope: Scope,
    isLockable: boolean = false,
    hasLabel: boolean = false;

  // Second: define const variables if needed

  // Define dot limits from props data
  const limitLeftByPoint = data[0].x;
  const limitRightByPoint = data[data.length - 1].x;

  // Define chart dimensions
  const chartWidth = 360;
  const chartHeight = 240;

  // Third: define component state
  let svgElement: SVGElement;
  let locked = false;

  // Fourth: define lifecycle functions
  onMount(() => {
    // Call the function to create the SVG chart
    createSVGChart();
  });

  // Fifth: declare reactive variables/statements
  $: buttonText = locked ? L.unlock : L.lock;

  // Sixth: declare functions component
  function toggleLock() {
    locked = !locked;
    redrawGraph();
  }

  function drawGraphLine(svg, data, xStep, yStep) {
    // Create the SVG path element
    const graphLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );

    // Start the 'd' path string with the coordinates of the first data point
    const { svgX: initialX, svgY: initialY } = getSVGCoordinates(
      data[0].x,
      data[0].y,
      xStep,
      yStep
    );
    let d = `M${initialX},${initialY}`;

    for (let i = 1; i < data.length; i++) {
      const { svgX, svgY } = getSVGCoordinates(
        data[i].x,
        data[i].y,
        xStep,
        yStep
      );
      d += ` L${svgX},${svgY}`;
    }

    graphLine.setAttribute("d", d);
    graphLine.setAttribute("fill", "none");
    graphLine.setAttribute("stroke", "blue");
    graphLine.setAttribute("stroke-width", "2");
    svg.appendChild(graphLine);

    // Add event listeners to make the points draggable
    data.forEach((point, index) => {
      const { svgX, svgY } = getSVGCoordinates(point.x, point.y, xStep, yStep);

      const rounded = (num: number) => Math.round(num * 10) / 10;
      addTextToSVG(
        svg,
        svgX,
        svgY,
        `${rounded(point.x)}, ${rounded(point.y)}`,
        "11",
        "black"
      );

      const isInside = isPointInsideSquare(
        svgX, // X-coordinate of the data point
        svgY, // Y-coordinate of the data point
        40 + scope?.minX * xStep, // X-coordinate of the square
        260 - scope?.maxY * yStep, // Y-coordinate of the square
        (scope?.maxX - scope?.minX) * xStep, // Width of the square
        (scope?.maxY - scope?.minY) * yStep // Height of the square
      );

      // Create the SVG circle elements
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );

      // Make the points draggable and visible only if they are
      // inside the square and the chart is not locked
      if (isInside && !locked) {
        circle.setAttribute("cx", svgX.toString());
        circle.setAttribute("cy", svgY.toString());
        circle.setAttribute("r", "6");
        circle.setAttribute("fill", "blue");
        circle.setAttribute("cursor", "grab");
        svg.appendChild(circle);
      }

      // internal dot state
      let isLockedIndividually = false;
      let isDragging = false;

      // Function to manage the dragging of the points
      const movePoint = (event) => {
        if (isDragging && !isLockedIndividually) {
          const rect = svg.getBoundingClientRect();
          const mouseX = event.clientX || event.touches[0].clientX;
          const mouseY = event.clientY || event.touches[0].clientY;
          const newX = (mouseX - rect.left - 40) / xStep;
          const newY = (260 - (mouseY - rect.top)) / yStep;

          const insideGraph =
            newX >= 0 && newX <= 10 && newY >= 0 && newY <= 10;
          const insideArea =
            newX >= scope.minX &&
            newX <= scope.maxX &&
            newY >= scope.minY &&
            newY <= scope.maxY;

          // managing dot's behavior
          if (insideGraph && insideArea) {
            // USE CASES
            // is the first point
            if (index === 0) {
              if (newX > limitLeftByPoint && newX < data[index + 1].x) {
                data[index].x = newX.toFixed(2);
                data[index].y = newY.toFixed(2);
              }
              // is the last point
            } else if (index === data.length - 1) {
              if (newX > data[index - 1].x && newX < limitRightByPoint) {
                data[index].x = newX.toFixed(2);
                data[index].y = newY.toFixed(2);
              }
            } else {
              if (newX > data[index - 1].x && newX < data[index + 1].x) {
                data[index].x = newX.toFixed(2);
                data[index].y = newY.toFixed(2);
              }
            }
            redrawGraph();
          }
        }
      };

      const startDrag = () => {
        isDragging = true;
      };

      const endDrag = () => {
        isDragging = false;
      };

      // Add event listeners to make the points draggable
      circle.addEventListener("mousedown", startDrag);
      circle.addEventListener("touchstart", startDrag);
      document.addEventListener("mouseup", endDrag);
      document.addEventListener("touchend", endDrag);
      document.addEventListener("mousemove", movePoint);
      document.addEventListener("touchmove", movePoint);

      // Add event listener to lock/unlock the points individually
      circle.addEventListener("click", () => {
        isLockedIndividually = !isLockedIndividually;
        if (isLockedIndividually) {
          circle.setAttribute("fill", "red");
        } else {
          circle.setAttribute("fill", "blue");
        }
      });
    });
  }

  // Function to redraw the graph line when points are moved
  function redrawGraph() {
    svgElement.innerHTML = ""; // Clear the chart

    // Calculate x and y axis steps based on the chart dimensions and data range
    const xMax = 10;
    const yMax = 10;
    const xStep = chartWidth / xMax;
    const yStep = chartHeight / yMax;

    drawSquare(svgElement, xStep, yStep, scope);
    drawAxes(svgElement, xMax, yMax, xStep, yStep, hasLabel);
    drawGraphLine(svgElement, data, xStep, yStep);
  }

  // Main function to create the SVG chart
  function createSVGChart() {
    // Calculate x and y axis steps based on the chart dimensions and data range
    const xMax = 10;
    const yMax = 10;
    const xStep = chartWidth / xMax;
    const yStep = chartHeight / yMax;

    // Draw the square
    drawSquare(svgElement, xStep, yStep, scope);

    // Draw the x and y axes
    drawAxes(svgElement, xMax, yMax, xStep, yStep, hasLabel);

    // Draw the graph line
    drawGraphLine(svgElement, data, xStep, yStep);
  }
</script>

<div>
  <svg width="400" height="300" bind:this={svgElement} />

  {#if isLockable}
    <div>
      <Button text={buttonText} on:click={toggleLock} />
      <p>{L.lockButtonText}</p>
    </div>
  {/if}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2em;
  }

  svg {
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
  }
</style>
