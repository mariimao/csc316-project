(function() {
  const container = d3.select("#worldViewmap");

  // Tooltip card
  const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background", "#1c1c1c")
    .style("color", "white")
    .style("padding", "10px 15px")
    .style("border-radius", "8px")
    .style("pointer-events", "none")
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "13px")
    .style("opacity", 0)
    .style("box-shadow", "0px 4px 15px rgba(0,0,0,0.4)");

  function getMapDimensions() {
    const node = document.getElementById("worldViewmap");
    const w = node.clientWidth || 960;
    return { width: w, height: Math.round(w * 0.62) };
  }

  const { width, height } = getMapDimensions();

  const svg = container.append("svg")
    .attr("width", width)
    .attr("height", height);

  // Country name mapping for topojson
  const countryNameMap = new Map([
    ["United States", "United States of America"],
    // add more as needed
  ]);

  Promise.all([
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
    d3.tsv("data/netflix-top-10/2025-10-07_global_weekly.tsv")
  ]).then(([worldData, data]) => {

    // Aggregate top 10 shows per country
    function aggregateData(dataset) {
      return d3.rollup(
        dataset,
        v => {
          const topShows = d3.rollup(
            v,
            vv => d3.sum(vv, d => +d.cumulative_weeks_in_top_10),
            d => d.show_title
          );
          return Array.from(topShows, ([title, weeks]) => ({ title, weeks }))
                      .sort((a,b) => b.weeks - a.weeks)
                      .slice(0, 10);
        },
        d => countryNameMap.get(d.country_name) || d.country_name
      );
    }

    const countryShows = aggregateData(data);

    const countries = topojson.feature(worldData, worldData.objects.countries);
    const projection = d3.geoNaturalEarth1().fitSize([width, height], countries);
    const path = d3.geoPath(projection);

    const netflixRed = "#E50914";
    const countryTotals = new Map(
      Array.from(countryShows, ([name, shows]) => [name, d3.sum(shows, d => d.weeks)])
    );
    const maxWeeks = d3.max(countryTotals.values()) || 1;

    const colorScale = d3.scaleLinear()
      .domain([0, Math.log1p(maxWeeks)])
      .range(["#F6B3B0", netflixRed]);

    // Draw countries
    const paths = svg.selectAll("path")
      .data(countries.features)
      .join("path")
      .attr("fill", d => {
        const total = countryTotals.get(d.properties.name);
        return total ? colorScale(Math.log1p(total)) : "#eeeeee";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5)
      .attr("d", path)
      .on("mouseover", (event, d) => {
        const shows = countryShows.get(d.properties.name) || [];
        tooltip.style("opacity", 1)
          .html(`
            <div style="border-bottom:2px solid ${netflixRed}; padding-bottom:4px; margin-bottom:6px;">
              <strong style="font-size:14px;">${d.properties.name}</strong>
              <strong style="font-size:14px;">'s Top 10 Favorite Shows </strong>
            </div>
            ${shows.length 
              ? shows.map((s,i) => `<div style="margin-bottom:2px;">${i+1}. <span style="color:${netflixRed}">${s.title}</span> (${s.weeks} weeks)</div>`).join("")
              : "<div style='color:#ccc;'>No Netflix data</div>"
            }
          `);
      })
      .on("mousemove", event => {
        tooltip.style("left", (event.pageX + 15) + "px")
               .style("top", (event.pageY - 15) + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    // Country search input, for later if we want to make the map more interactive
    // const searchContainer = d3.select("body")
    //   .append("div")
    //   .attr("id", "map-search")
    //   .style("position", "fixed")
    //   .style("top", "10px")
    //   .style("left", "10px")
    //   .style("background", "white")
    //   .style("padding", "10px")
    //   .style("border-radius", "5px")
    //   .style("box-shadow", "0px 0px 6px rgba(0,0,0,0.2)");

    // searchContainer.append("label")
    //   .text("Search Country: ")
    //   .style("margin-right", "5px");

    // const input = searchContainer.append("input")
    //   .attr("type", "text")
    //   .attr("placeholder", "Type country name");

    // input.on("input", () => {
    //   const val = input.property("value").toLowerCase();
    //   paths.attr("fill", d => {
    //     const total = countryTotals.get(d.properties.name);
    //     if (val && d.properties.name.toLowerCase().includes(val)) {
    //       return "#ff8c00"; // highlight search
    //     }
    //     return total ? colorScale(Math.log1p(total)) : "#eeeeee";
    //   });
    // });

  });

})();
