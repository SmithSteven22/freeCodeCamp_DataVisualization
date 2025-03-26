const width = 960;
const height = 600;

const svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("#tooltip")
  .style("opacity", 0); // Ensure tooltip is hidden by default

const colorScale = d3.scaleThreshold()
  .domain(d3.range(0.1, 1, 0.2))
  .range(d3.schemeBlues[5]);

d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
  .then(topology => {
    const counties = topojson.feature(topology, topology.objects.counties).features;

    d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
      .then(educationData => {
        const dataMap = new Map(educationData.map(d => [d.fips, d]));

        svg.selectAll(".county")
          .data(counties)
          .enter()
          .append("path")
          .attr("class", "county")
          .attr("d", d3.geoPath())
          .attr("fill", d => colorScale(dataMap.get(d.id).bachelorsOrHigher / 100))
          .attr("data-fips", d => d.id)
          .attr("data-education", d => dataMap.get(d.id).bachelorsOrHigher)
          .on("mouseover", (event, d) => {
            const countyData = dataMap.get(d.id);
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(`${countyData.area_name}, ${countyData.state}: ${countyData.bachelorsOrHigher}%`)
              .attr("data-education", countyData.bachelorsOrHigher)
              .style("left", `${event.pageX + 5}px`)
              .style("top", `${event.pageY - 28}px`);
          })
          .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
          });

        const legend = d3.select("#legend")
          .append("svg")
          .attr("width", 300)
          .attr("height", 50);

        legend.selectAll("rect")
          .data(colorScale.range())
          .enter()
          .append("rect")
          .attr("x", (d, i) => i * 60)
          .attr("y", 0)
          .attr("width", 60)
          .attr("height", 20)
          .attr("fill", d => d);

        legend.selectAll("text")
          .data(colorScale.domain())
          .enter()
          .append("text")
          .attr("x", (d, i) => i * 60 + 5)
          .attr("y", 40)
          .text(d => `${Math.round(d * 100)}%`);
      });
  });
