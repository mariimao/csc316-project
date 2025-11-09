/**
 * Bubble Chart Visualization
 * Displays the top 10 most popular TV genres as a force-directed bubble chart
 */

const width = 800;
const height = 500;
const legendRectSize = 18;
const legendSpacing = 4;

const svg = d3.select("#bubbleChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#000000");

d3.tsv("data/tmdb/tmdb_tv_reduced.tsv").then(data => {
    const genreCounts = {};

    data.forEach(d => {
        if (d.genres) {
            d.genres.split(", ").forEach(genre => {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
        }
    });

    let genresArray = Object.keys(genreCounts).map(genre => ({
        genre,
        count: genreCounts[genre]
    }));

    genresArray = genresArray
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(genresArray, d => d.count)])
        .range([25, 70]);

    const simulation = d3.forceSimulation(genresArray)
        .force("charge", d3.forceManyBody().strength(5))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => radiusScale(d.count) + 4))
        .stop();

    for (let i = 0; i < 300; i++) simulation.tick();

    genresArray.forEach(d => {
        const r = radiusScale(d.count);
        d.x = Math.max(r, Math.min(width - r, d.x));
        d.y = Math.max(r, Math.min(height - r, d.y));
    });

    const nodes = svg.selectAll("g.bubble")
        .data(genresArray)
        .enter()
        .append("g")
        .attr("class", "bubble")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    nodes.append("circle")
        .attr("r", d => radiusScale(d.count))
        .attr("fill", d => color(d.genre))
        .attr("stroke", "#555")
        .attr("stroke-width", 1.5);

    nodes.append("text")
        .text(d => d.genre)
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .style("font-size", "13px")
        .style("font-family", "sans-serif")
        .style("fill", "#ffffffff")
        .style("pointer-events", "none");

    nodes.append("title")
        .text(d => `${d.genre}: ${d.count} shows`);

    const legend = svg.selectAll(".legend")
        .data(genresArray)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(20, ${i * (legendRectSize + legendSpacing) + 20})`);

    legend.append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .attr("fill", d => color(d.genre))
        .attr("stroke", "#ffffffff");

    legend.append("text")
        .attr("x", legendRectSize + 2)
        .attr("y", legendRectSize - 4)
        .style("font-size", "13px")
        .style("font-family", "sans-serif")
        .style("fill", "#ffffffff")
        .text(d => d.genre);

    svg.append("text")
        .attr("x", width - 20)
        .attr("y", height - 15)
        .attr("text-anchor", "end")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
        .style("fill", "#ffffffff")
        .text("Data source: TMDB");
});

