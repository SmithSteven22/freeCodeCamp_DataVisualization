const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

const width = 960;
const height = 600;

const svg = d3.select("#treemap")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("#tooltip")
  .style("opacity", 0);

d3.json(url).then(data => {
  const root = d3.hierarchy(data).sum(d => d.value);
  const treemap = d3.treemap().size([width, height]).padding(1);
  treemap(root);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const tiles = svg.selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);

  // Add tiles
  tiles.append("rect")
    .attr("class", "tile")
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .attr("fill", d => color(d.data.category))
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
        .attr("data-value", d.data.value)
        .style("left", `${event.pageX + 5}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  // Add text (only the name) to tiles
  tiles.append("text")
    .attr("x", 5)
    .attr("y", 15)
    .text(d => d.data.name)
    .style("font-size", "10px")
    .style("fill", "#000"); // Set text color to black

  // Legend
  const categories = [...new Set(root.leaves().map(d => d.data.category))];
  const legend = d3.select("#legend")
    .append("svg")
    .attr("width", 300)
    .attr("height", 50);

  legend.selectAll("rect")
    .data(categories)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .attr("x", (d, i) => i * 60)
    .attr("y", 10)
    .attr("width", 50)
    .attr("height", 20)
    .attr("fill", d => color(d));

  legend.selectAll("text")
    .data(categories)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * 60 + 5)
    .attr("y", 30)
    .text(d => d)
    .style("font-size", "12px");
});
