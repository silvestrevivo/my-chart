import type { Scope } from "$types/index";

// Function to convert data points to SVG coordinates
export function getSVGCoordinates(
  x: number,
  y: number,
  xStep: number,
  yStep: number
): { svgX: number; svgY: number } {
  const svgX = 40 + x * xStep;
  const svgY = 260 - y * yStep;
  return { svgX, svgY };
}

// Function to draw the x and y axes
export function drawAxes(
  svg: SVGElement,
  xMax: number,
  yMax: number,
  xStep: number,
  yStep: number,
  label: boolean
): void {
  const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  xAxis.setAttribute("x1", "30");
  xAxis.setAttribute("y1", "260");
  xAxis.setAttribute("x2", "390");
  xAxis.setAttribute("y2", "260");
  xAxis.setAttribute("stroke", "black");
  xAxis.setAttribute("stroke-width", "2");
  svg.appendChild(xAxis);

  const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  yAxis.setAttribute("x1", "40");
  yAxis.setAttribute("y1", "20");
  yAxis.setAttribute("x2", "40");
  yAxis.setAttribute("y2", "260");
  yAxis.setAttribute("stroke", "black");
  yAxis.setAttribute("stroke-width", "2");
  svg.appendChild(yAxis);

  // Draw ticks on the x-axis
  for (let i = 0; i <= xMax; i++) {
    const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
    tick.setAttribute("x1", (40 + i * xStep).toString());
    tick.setAttribute("y1", "260");
    tick.setAttribute("x2", (40 + i * xStep).toString());
    tick.setAttribute("y2", (265).toString());
    tick.setAttribute("stroke", "black");
    svg.appendChild(tick);

    // Add labels to the x-axis
    if (label) {
      const label = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      label.setAttribute("x", (40 + i * xStep).toString());
      label.setAttribute("y", (280).toString());
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "12");
      label.textContent = i.toString();
      svg.appendChild(label);
    }
  }

  // Draw ticks on the y-axis
  for (let i = 0; i <= yMax; i++) {
    const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
    tick.setAttribute("x1", "40");
    tick.setAttribute("y1", (260 - i * yStep).toString());
    tick.setAttribute("x2", "35");
    tick.setAttribute("y2", (260 - i * yStep).toString());
    tick.setAttribute("stroke", "black");
    svg.appendChild(tick);

    // Add labels to the y-axis
    if (label) {
      const label = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      label.setAttribute("y", (30 + i * (xStep * 0.65)).toString());
      label.setAttribute("x", (20).toString());
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "12");
      label.textContent = (yMax - i).toString();
      svg.appendChild(label);
    }
  }
}

// Function to draw the square
export function drawSquare(
  svg: SVGElement,
  xStep: number,
  yStep: number,
  scope: Scope
) {
  const square = document.createElementNS("http://www.w3.org/2000/svg", "rect");

  square.setAttribute("x", (40 + scope?.minX * xStep).toString());
  square.setAttribute("y", (260 - scope?.maxY * yStep).toString());
  square.setAttribute(
    "width",
    ((scope?.maxX - scope?.minX) * xStep).toString()
  );
  square.setAttribute(
    "height",
    ((scope?.maxY - scope?.minY) * yStep).toString()
  );
  square.setAttribute("fill", "lightgray");
  svg.appendChild(square);
}

export function isPointInsideSquare(
  pointX: number,
  pointY: number,
  squareX: number,
  squareY: number,
  squareWidth: number,
  squareHeight: number
): boolean {
  return (
    pointX >= squareX &&
    pointX <= squareX + squareWidth &&
    pointY >= squareY &&
    pointY <= squareY + squareHeight
  );
}

// Function to add text at a specific position on the SVG
export function addTextToSVG(
  svg: SVGElement,
  x: number,
  y: number,
  textContent: string,
  fontSize: string,
  textColor: string
) {
  const textElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  textElement.setAttribute("x", x.toString());
  textElement.setAttribute("y", y.toString());
  textElement.setAttribute("font-size", fontSize);
  textElement.setAttribute("fill", textColor);
  textElement.textContent = textContent;
  svg.appendChild(textElement);
}
