const dataURL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// Fetch data and create the chart
d3.json(dataURL).then(data => {
  const dataset = data.data;
  const width = 800;
  const height = 400;
  const padding = 50;

  const svg = d3.select("#chart");

  // Scales
  const xScale = d3.scaleTime()
    .domain([new Date(d3.min(dataset, d => d[0])), new Date(d3.max(dataset, d => d[0]))])
    .range([padding, width - padding]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([height - padding, padding]);

  // Axes
  const xAxis = d3.axisBottom(xScale).ticks(10);
  const yAxis = d3.axisLeft(yScale).ticks(10);

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  // Bars
  svg.selectAll(".bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(new Date(d[0])))
    .attr("y", d => yScale(d[1]))
    .attr("width", (width - 2 * padding) / dataset.length)
    .attr("height", d => height - padding - yScale(d[1]))
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .on("mouseover", (event, d) => {
      const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("background-color", "#fff")
        .style("border", "1px solid black")
        .style("padding", "5px")
        .style("opacity", 0.9)
        .attr("data-date", d[0])
        .html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`);

      tooltip.style("left", `${event.pageX + 5}px`)
        .style("top", `${event.pageY - 40}px`);
    })
    .on("mouseout", () => {
      d3.select("#tooltip").remove();
    });
});
