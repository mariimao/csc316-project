/**
 * Line Chart Visualization
 * X axis = year, Y axis = number of shows that started that year, shows top 10 genres
 */

function getLineChartDimensions() {
    const container = d3.select("#lineChart").node();
    if (!container) return { width: 800, height: 500 };

    const containerWidth = container.clientWidth || container.offsetWidth || window.innerWidth - 40;
    const containerHeight = container.clientHeight || container.offsetHeight || 500;

    const maxWidth = Math.min(1000, window.innerWidth - 40);
    const width = Math.max(480, Math.min(containerWidth || maxWidth, maxWidth));
    const height = Math.max(320, Math.min(containerHeight || 600, 600));

    return { width, height };
}

setTimeout(() => {
    // clear any previous contents
    d3.select("#lineChart").selectAll("*").remove();

    const { width, height } = getLineChartDimensions();
    const margin = { top: 40, right: 160, bottom: 60, left: 60 };
    const innerWidth = Math.max(200, width - margin.left - margin.right);
    const innerHeight = Math.max(150, height - margin.top - margin.bottom);

    d3.select("#lineChart")
        .append("p")
        .attr("class", "subtitle")
        .style("margin-bottom", "-10px")
        .text("Number of shows started per year by genre");

    const svg = d3.select("#lineChart")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        // Transparent so it blends with the page background
        .style("background-color", "transparent")
        .style("min-height", `${Math.max(320, innerHeight + margin.top + margin.bottom)}px`);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let linetooltip = d3.select('#linetooltip');
    if (linetooltip.empty()) {
        linetooltip = d3.select('body')
            .append('div')
            .attr('id', 'linetooltip')
            .style('position', 'absolute')
            .style('pointer-events', 'none')
            .style('background', 'rgba(0,0,0,0.85)')
            .style('color', '#fff')
            .style('padding', '6px 8px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('font-family', 'sans-serif')
            .style('opacity', 0)
            .style('z-index', 9999);
    }

    d3.tsv("data/tmdb/tmdb_tv_reduced.tsv").then(data => {
        // parse and aggregate
        const genreCounts = {};
        const genreYearAgg = {}; // genre -> year -> {sum, count}

        // Exclude shows that started in some years entirely
        data.forEach(d => {
            const pop = +d.popularity || 0;
            const year = d.first_air_date && d.first_air_date.length >= 4 ? +d.first_air_date.slice(0,4) : null;
            if (!d.genres || year === null || year === 2025 || year === 2026 || year === 2024) return;

            d.genres.split(", ").forEach(g => {
                genreCounts[g] = (genreCounts[g] || 0) + 1;
                genreYearAgg[g] = genreYearAgg[g] || {};
                const entry = genreYearAgg[g][year] || { sum: 0, count: 0 };
                // keep sum if needed later, but y will use count (number of shows)
                entry.sum += pop;
                entry.count += 1;
                genreYearAgg[g][year] = entry;
            });
        });

        // pick top 10 genres by count
        const topGenres = Object.keys(genreCounts)
            .map(g => ({ genre: g, count: genreCounts[g] }))
            .sort((a,b) => b.count - a.count)
            .slice(0, 10)
            .map(d => d.genre);

        if (topGenres.length === 0) {
            chart.append("text")
                .attr("x", innerWidth/2)
                .attr("y", innerHeight/2)
                .attr("text-anchor", "middle")
                .style("fill", "#fff")
                .text("No genre data available");
            return;
        }

        // build per-genre series of {year, count}
        let allYears = new Set();
        const series = topGenres.map(genre => {
            const yearsObj = genreYearAgg[genre] || {};
            const points = Object.keys(yearsObj).map(y => {
                const yr = +y;
                allYears.add(yr);
                return { year: yr, count: yearsObj[yr].count };
            }).sort((a,b) => a.year - b.year);
            return { genre, points };
        });

        const years = Array.from(allYears).sort((a,b) => a-b);
        const minYear = d3.min(years);
        const maxYear = d3.max(years);

        // find the earliest year where ALL topGenres have data
        const yearCounts = {};
        // count presence per year across top genres
        topGenres.forEach(g => {
            const yearsObj = genreYearAgg[g] || {};
            Object.keys(yearsObj).forEach(y => {
                const yy = +y;
                yearCounts[yy] = (yearCounts[yy] || 0) + 1;
            });
        });

        const commonYears = Object.keys(yearCounts)
            .map(y => +y)
            .filter(y => yearCounts[y] === topGenres.length)
            .sort((a,b) => a - b);

        const startYear = commonYears.length ? commonYears[0] : minYear;

        // drop points before the startYear so lines begin where all 10 genres appear
        series.forEach(s => {
            s.points = s.points.filter(p => p.year >= 2000);
        });

        // if filtering removed all points for a series, keep it empty (won't draw)
        const effectiveMinYear = 2000;
        const effectiveMaxYear = maxYear;
        // compute y max based on counts (number of shows)
        const maxCount = d3.max(series, s => d3.max(s.points, p => p.count)) || 1;

        const xScale = d3.scaleTime()
            .domain([new Date(effectiveMinYear,0,1), new Date(effectiveMaxYear,0,1)])
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, maxCount])
            .nice()
            .range([innerHeight, 0]);

        const color = d3.scaleOrdinal(d3.schemeTableau10).domain(topGenres);

        // axes
        const xAxis = d3.axisBottom(xScale).ticks(Math.min(10, Math.max(3, effectiveMaxYear - effectiveMinYear))).tickFormat(d3.timeFormat("%Y"));
        const yAxis = d3.axisLeft(yScale).ticks(6);

        chart.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .selectAll("text")
            .style("fill", "#ffffff");

        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(xAxis)
            .selectAll("text")
            .style("fill", "#ffffff");

        // gridlines (optional subtle)
        chart.append("g")
            .attr("class", "grid")
            .selectAll("line.horizontal")
            .data(yScale.ticks(6))
            .enter()
            .append("line")
            .attr("x1", 0)
            .attr("x2", innerWidth)
            .attr("y1", d => yScale(d))
            .attr("y2", d => yScale(d))
            .style("stroke", "#222")
            .style("stroke-width", 1);

        // line generator (y uses count)
        const line = d3.line()
            .defined(d => d.count != null)
            .x(d => xScale(new Date(d.year,0,1)))
            .y(d => yScale(d.count));

        // draw lines and points
        const genreGroup = chart.selectAll(".genre")
            .data(series)
            .enter()
            .append("g")
            .attr("class", "genre");

        genreGroup.append("path")
            .datum(d => d)
            .attr("class", d => `line line-${d.genre.replace(/[^a-zA-Z0-9_-]/g, '-')}`)
            .attr("d", d => line(d.points))
            .style("fill", "none")
            .style("stroke", d => color(d.genre))
            .style("stroke-width", 1.5)
            .style("opacity", 0.95);

        // circles (use count)
        genreGroup.selectAll("circle")
            .data(d => d.points.map(p => ({ genre: d.genre, year: p.year, count: p.count })))
            .enter()
            .append("circle")
            .attr("class", d => `point point-${d.genre.replace(/[^a-zA-Z0-9_-]/g, '-')}`)
            .attr("cx", d => xScale(new Date(d.year,0,1)))
            .attr("cy", d => yScale(d.count))
            .attr("r", 3.5)
            .attr("fill", d => color(d.genre))
            .attr("stroke", "#111")
            .attr("stroke-width", 0.8)
            .on("mouseover", (event, d) => {
                // show tooltip with year and count (interrupt any hide transition so it appears immediately)
                linetooltip.html(`
                    <strong>${d.genre} ${d.year}</strong><br>
                    Shows: ${d.count}
                    `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY + 10) + "px")
                    .transition()
                    .duration(10)
                    .style("opacity", 1);
                d3.select(event.currentTarget).attr("r", 6);
            })
            .on("mousemove", (event) => {
                // position tooltip near pointer
                linetooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY + 10) + "px");
            })
            .on("mouseout", (event) => {
                // fade tooltip out instead of hiding instantly
                linetooltip.transition().duration(500).style("opacity", 0);
                d3.select(event.currentTarget).attr("r", 3.5);
            });

        // title (reflects count)
        // svg.append("text")
        //     .attr("x", margin.left)
        //     .attr("y", margin.top / 2)
        //     .attr("class", "subtitle")
        //     .attr("text-anchor", "start")
        //     .style("fill", "#ffffff")
        //     .style("font-family", "sans-serif")
        //     .style("font-size", `${Math.max(14, Math.min(18, width / 50))}px`)
        //     .text("Number of shows started per year by genre");

        // data source
        svg.append("text")
            .attr("x", width - 20)
            .attr("y", height - 10)
            .attr("text-anchor", "end")
            .style("font-size", `${Math.max(9, Math.min(12, width / 65))}px`)
            .style("font-family", "sans-serif")
            .style("fill", "#ffffff")
            .text("Data source: TMDB");

        // legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width - margin.right + 10}, ${margin.top})`);

        const legendItem = legend.selectAll(".legend-item")
            .data(series)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`)
            .style("cursor", "pointer")
            .on("click", function(event, d) {
                const cls = d.genre.replace(/[^a-zA-Z0-9_-]/g, '-');
                const currentlyVisible = d3.select(`.line-${cls}`).style("display") !== "none";

                // fade legend text
                d3.select(this).select("text").style("opacity", currentlyVisible ? 0.4 : 1);

                // toggle line
                d3.selectAll(`.line-${cls}`)
                    .style("display", currentlyVisible ? "none" : null);

                // toggle points
                d3.selectAll(`.point-${cls}`)
                    .style("display", currentlyVisible ? "none" : null);
            });

        legendItem.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", d => color(d.genre))
            .attr("stroke", "#333");

        legendItem.append("text")
            .attr("x", 18)
            .attr("y", 9)
            .style("font-size", "12px")
            .style("fill", "#fff")
            .text(d => d.genre);

        // Helper to subtly highlight a selected genre line with a soft glow,
        // and emphasize its legend entry, without making other lines less prominent.
        function applyLineHighlight(selectedGenre) {
            genreGroup.select("path.line")
                .style("stroke-width", d => d.genre === selectedGenre ? 3.2 : 2.5)
                .style("filter", d =>
                    d.genre === selectedGenre
                        ? "drop-shadow(0 0 8px rgba(255, 218, 106, 0.8))"
                        : "none"
                );

            legendItem.select("rect")
                .attr("stroke", d => d.genre === selectedGenre ? "#ffda6a" : "#333")
                .attr("stroke-width", d => d.genre === selectedGenre ? 2 : 1);

            legendItem.select("text")
                .style("fill", d => d.genre === selectedGenre ? "#ffda6a" : "#fff");
        }

        // Expose a global hook so the character selection screen can trigger a highlight.
        window.highlightLineGenre = function(selectedGenre) {
            applyLineHighlight(selectedGenre);
        };

        // If the user already picked a genre before the line chart finished loading,
        // highlight that genre right away.
        if (window.selectedGenre) {
            applyLineHighlight(window.selectedGenre);
        }
    });
}, 100);

