/**
 * Bubble Chart Visualization
 * Displays the top 10 most popular TV genres as a force-directed bubble chart
 */

// Get container dimensions for responsive sizing
function getBubbleChartDimensions() {
    const container = d3.select("#bubbleChart").node();
    if (!container) return { width: 800, height: 500 };
    
    // Wait for container to be available, use offsetWidth as fallback
    const containerWidth = container.clientWidth || container.offsetWidth || window.innerWidth - 40;
    const containerHeight = container.clientHeight || container.offsetHeight || 500;
    
    // Use container width, maintain aspect ratio, ensure minimum size
    const maxWidth = Math.min(800, window.innerWidth - 40);
    const width = Math.max(300, Math.min(containerWidth || maxWidth, maxWidth));
    const height = Math.max(400, Math.min(width * 0.625, containerHeight || 500, 500));
    
    return { width, height };
}

// Initialize with a small delay to ensure DOM is ready
setTimeout(() => {
    const { width, height } = getBubbleChartDimensions();
    const legendRectSize = 18;
    const legendSpacing = 4;

    const svg = d3.select("#bubbleChart")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("background-color", "#000000")
        .style("min-height", "400px");

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

        // Responsive font size based on container width
        const baseFontSize = Math.max(10, Math.min(13, width / 60));
        
        nodes.append("text")
            .text(d => d.genre)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .style("font-size", `${baseFontSize}px`)
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
            .style("font-size", `${baseFontSize}px`)
            .style("font-family", "sans-serif")
            .style("fill", "#ffffffff")
            .text(d => d.genre);

        const sourceFontSize = Math.max(9, Math.min(12, width / 65));
        svg.append("text")
            .attr("x", width - 20)
            .attr("y", height - 15)
            .attr("text-anchor", "end")
            .style("font-size", `${sourceFontSize}px`)
            .style("font-family", "sans-serif")
            .style("fill", "#ffffffff")
            .text("Data source: TMDB");
    });
}, 100);

