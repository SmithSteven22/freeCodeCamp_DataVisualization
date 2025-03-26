const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const margin = { top: 80, right: 50, bottom: 80, left: 100 };
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("#tooltip");

d3.json(url).then(data => {
  const baseTemp = data.baseTemperature;
  const dataset = data.monthlyVariance;

  const xScale = d3.scaleBand()
    .domain(dataset.map(d => d.year))
    .range([0, width]);

  const yScale = d3.scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .range([height, 0]);

  const colorScale = d3.scaleQuantize()
    .domain([d3.min(dataset, d => baseTemp + d.variance), d3.max(dataset, d => baseTemp + d.variance)])
    .range(["#2c7bb6", "#00a6ca", "#00ccbc", "#90eb9d", "#ffff8c", "#f9d057", "#f29e2e", "#e76818", "#d7191c"]);

  svg.selectAll(".cell")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.month - 1))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("data-month", d => d.month - 1)
    .attr("data-year", d => d.year)
    .attr("data-temp", d => baseTemp + d.variance)
    .attr("fill", d => colorScale(baseTemp + d.variance))
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`${d.year} - ${d.month}<br>${(baseTemp + d.variance).toFixed(2)}℃`)
        .attr("data-year", d.year)
        .style("left", `${event.pageX + 5}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  const xAxis = d3.axisBottom(xScale).tickValues(xScale.domain().filter(year => year % 10 === 0));
  const yAxis = d3.axisLeft(yScale).tickFormat(month => {
    const date = new Date(0);
    date.setUTCMonth(month);
    return d3.timeFormat("%B")(date);
  });

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  svg.append("text")
    .attr("transform", `translate(${width / 2},${height + margin.bottom - 20})`)
    .style("text-anchor", "middle")
    .text("Years");

  svg.append("g")
    .attr("id", "y-axis")
    .call(yAxis);
  
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 40)
    .attr("x", -height / 2)
    .style("text-anchor", "middle")
    .text("Months");

  const legend = d3.select("#legend")
    .append("svg")
    .attr("width", 400)
    .attr("height", 50);

  const legendScale = d3.scaleLinear()
    .domain(colorScale.domain())
    .range([0, 300]);

  const legendAxis = d3.axisBottom(legendScale).ticks(5);

  legend.append("g")
    .attr("transform", "translate(50, 30)")
    .call(legendAxis);

  legend.selectAll("rect")
    .data(colorScale.range().map(color => {
      const d = colorScale.invertExtent(color);
      return d[0] === undefined ? colorScale.domain()[0] : d[0];
    }))
    .enter()
    .append("rect")
    .attr("x", (d, i) => 50 + i * (300 / colorScale.range().length))
    .attr("y", 0)
    .attr("width", 300 / colorScale.range().length)
    .attr("height", 20)
    .attr("fill", d => colorScale(d));
});
