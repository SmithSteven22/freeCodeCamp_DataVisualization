const width = 700; // Reduced width for better centering
const height = 500;
const margin = { top: 40, right: 80, bottom: 60, left: 80 }; // Balanced left and right margins

const svg = d3
  .select("#graph")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`); // Updated translation

const tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((response) => response.json())
  .then((data) => {
    const timeParse = d3.timeParse("%M:%S");
    const timeFormat = d3.timeFormat("%M:%S");
    data.forEach((d) => {
      d.Time = timeParse(d.Time);
    });

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.Year) - 1,
        d3.max(data, (d) => d.Year) + 1,
      ])
      .range([0, width]);

    const yScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Time))
      .range([0, height]);

    // Axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    svg.append("g").attr("id", "y-axis").call(yAxis);

    // Y-Axis Label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("fill", "#333")
      .style("font-size", "12px")
      .text("Time in Minutes");

    // Data Points
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(d.Time))
      .attr("r", 6)
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => d.Time.toISOString())
      .attr("fill", (d) => (d.Doping ? "red" : "blue"))
      .on("mouseover", (e, d) => {
        tooltip
          .style("opacity", 0.9)
          .attr("data-year", d.Year)
          .html(
            `${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${timeFormat(
              d.Time
            )}${d.Doping ? `<br><br>${d.Doping}` : ""}`
          )
          .style("left", `${e.pageX + 10}px`)
          .style("top", `${e.pageY - 28}px`);
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    // Legend
    const legend = svg.append("g").attr("id", "legend");

    // Cyclists with Doping Allegations
    legend
      .append("rect")
      .attr("x", width - 150)
      .attr("y", 10)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "red");

    legend
      .append("text")
      .attr("x", width - 125)
      .attr("y", 22)
      .text("Cyclists with doping allegations")
      .style("font-size", "12px");

    // Cyclists without Doping Allegations
    legend
      .append("rect")
      .attr("x", width - 150)
      .attr("y", 30)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "blue");

    legend
      .append("text")
      .attr("x", width - 125)
      .attr("y", 42)
      .text("Cyclists without doping allegations")
      .style("font-size", "12px");
  });
