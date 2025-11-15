(function() {
  const container = d3.select("#worldHeatmap");

  // Tooltip
  const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background", "rgba(0,0,0,0.75)")
    .style("color", "white")
    .style("padding", "6px 10px")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("font-size", "13px")
    .style("opacity", 0);

  function getMapDimensions() {
    const node = document.getElementById("worldHeatmap");
    const w = node.clientWidth || 960;
    return { width: w, height: Math.round(w * 0.62) };
  }

  const { width, height } = getMapDimensions();

  const svg = container.append("svg")
    .attr("width", width)
    .attr("height", height);

  // Load data
  Promise.all([
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
    d3.tsv("data/tmdb/tmdb_movies_reduced.tsv"),
    d3.tsv("data/tmdb/tmdb_tv_reduced.tsv")
  ]).then(([worldData, movies, shows]) => {

    const countryCounts = new Map();

    function countProductions(dataset) {
      dataset.forEach(row => {
        const list = row.production_countries;
        if (!list) return;
        list.split(",").forEach(country => {
          const c = country.trim();
          if (!c) return;
          if (!countryCounts.has(c)) countryCounts.set(c, { movies: 0, tv: 0 });
          if (dataset === movies) countryCounts.get(c).movies += 1;
          else countryCounts.get(c).tv += 1;
        });
      });
    }

    countProductions(movies);
    countProductions(shows);

    const totalCounts = Array.from(countryCounts.values()).map(d => d.movies + d.tv);
    const maxValue = d3.max(totalCounts) || 1;

    const color = d3.scaleSequential()
      .domain([0, Math.log1p(maxValue)])
      .interpolator(d3.interpolateBlues);

    const countries = topojson.feature(worldData, worldData.objects.countries);
    const projection = d3.geoNaturalEarth1().fitSize([width, height], countries);
    const path = d3.geoPath(projection);

    svg.selectAll("path")
      .data(countries.features)
      .join("path")
      .attr("fill", d => {
        const count = countryCounts.get(d.properties.name);
        return count ? color(Math.log1p(count.movies + count.tv)) : "#eeeeee";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5)
      .attr("d", path)
      .on("mouseover", (event, d) => {
        const counts = countryCounts.get(d.properties.name);
        const moviesCount = counts ? counts.movies : 0;
        const tvCount = counts ? counts.tv : 0;
        tooltip.style("opacity", 1)
          .html(`<strong>${d.properties.name}</strong><br>` +
                `Movies: ${moviesCount}<br>TV Shows: ${tvCount}`);
      })
      .on("mousemove", event => {
        tooltip.style("left", (event.pageX + 10) + "px")
               .style("top", (event.pageY - 20) + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

  });
})();
