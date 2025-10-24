const width = 900;
const height = 600;
const legendRectSize = 18;
const legendSpacing = 4;

const svg = d3.select("#bubbleChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

d3.tsv("tmdb/TMDB_movie_dataset_v11.tsv").then(data => {
    const genreCounts = {};
    data.forEach(d => {
        if (d.genres) {
            d.genres.split(", ").forEach(genre => {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
        }
    });

    const genresArray = Object.keys(genreCounts).map(genre => ({
        genre,
        count: genreCounts[genre]
    }));

    const color = d3.scaleOrdinal()
        .domain(genresArray.map(d => d.genre))
        .range(d3.schemeCategory10.concat(d3.schemePaired, d3.schemeSet3));

    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(genresArray, d => d.count)])
        .range([10, 80]);

    const simulation = d3.forceSimulation(genresArray)
        .force("charge", d3.forceManyBody().strength(5))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => radiusScale(d.count) + 2))
        .stop();

    for (let i = 0; i < 300; i++) simulation.tick();

    const nodes = svg.selectAll("g")
        .data(genresArray)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    nodes.append("circle")
        .attr("r", d => radiusScale(d.count))
        .attr("fill", d => color(d.genre))
        .attr("stroke", "#333")
        .attr("stroke-width", 1);

    nodes.append("text")
        .text(d => d.genre)
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .style("pointer-events", "none");

    nodes.append("title")
        .text(d => `${d.genre}: ${d.count} movies`);

    const legend = svg.selectAll(".legend")
        .data(genresArray)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(10,${i * (legendRectSize + legendSpacing) + 10})`);

    legend.append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .attr("fill", d => color(d.genre))
        .attr("stroke", "#333");

    legend.append("text")
        .attr("x", legendRectSize + 4)
        .attr("y", legendRectSize - 4)
        .text(d => d.genre);
});
