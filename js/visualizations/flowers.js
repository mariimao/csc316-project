/**
 * Flowers Visualization
 * Code assisted by ChatGPT 5
 *
 * This module handles:
 * - Loading and preparing movie data
 * - Building flower data structures
 * - Drawing the flowers visualization
 */


let tmdbMovies = [];

let activeCompanies = ["Marvel Studios", "Warner Bros. Pictures", "Paramount"];
let allAvailableCompanies = [];

// Map the broader character-selection genres into the movie genres
// used in this flowers visualization.
function mapGenreForFlowers(selectedGenre) {
    if (!selectedGenre) return null;
    const g = String(selectedGenre).toLowerCase();
    
    if (g.includes("action")) return "Action";
    if (g.includes("sci-fi") || g.includes("sci fi") || g.includes("science")) return "Science Fiction";
    if (g.includes("fantasy")) return "Fantasy";
    if (g.includes("animation")) return "Animation";
    if (g.includes("documentary")) return "Documentary";
    if (g.includes("drama")) return "Drama";
    if (g.includes("comedy")) return "Comedy";
    if (g.includes("crime")) return "Crime";
    if (g.includes("family")) return "Family";
    if (g.includes("mystery")) return "Mystery";
    if (g.includes("horror")) return "Horror";
    if (g.includes("romance")) return "Romance";
    if (g.includes("thriller")) return "Thriller";
    
    return null;
}

/**
 * Load movie data and initialize the flowers visualization
 */
function loadFlowersData() {
    d3.tsv("data/tmdb/tmdb_movies_reduced.tsv", d3.autoType)
        .then(raw => {
            tmdbMovies = prepareMovies(raw);
            console.log("movies:", tmdbMovies.length);
            // Placeholder companies (this data should come from user's choice)
            // const companies = ["Marvel Studios", "Warner Bros. Pictures", "Paramount"];
            // const flowers = buildFlowers(companies, tmdbMovies);
            // console.log(flowers);
            // drawFlowers(flowers);
            initCompanyList(tmdbMovies);
            renderTags();
            updateVisualization();
        })
        .catch(console.error);
}


function initCompanyList(movies) {
    const companyMap = new Map();
    
    movies.forEach(m => {
        if(m.production_companies) {
            m.production_companies.forEach(c => {
                const cleanName = c.trim();
                companyMap.set(cleanName, (companyMap.get(cleanName) || 0) + 1);
            });
        }
    });
    
    // filter companies with at least 5 movies
    allAvailableCompanies = Array.from(companyMap.entries())
        .filter(([name, count]) => count >= 5)
        .map(([name, count]) => name)
        .sort();
    
    const datalist = d3.select("#company-list");
    datalist.selectAll("option").remove();
    
    allAvailableCompanies.forEach(company => {
        datalist.append("option").attr("value", company);
    });
}

function updateVisualization() {
    if (activeCompanies.length === 0) {
        d3.select("#garden").select("svg").remove();
        return;
    }
    
    const flowers = buildFlowers(activeCompanies, tmdbMovies);
    drawFlowers(flowers);
}

function renderTags() {
    const container = d3.select("#active-tags");
    
    const tags = container.selectAll(".company-tag")
        .data(activeCompanies, d => d); // key function important
    
    // Exit
    tags.exit().remove();
    
    // Enter
    const tagsEnter = tags.enter().append("div")
        .attr("class", "company-tag")
        .style("background", "rgba(255, 255, 255, 0.1)")
        .style("border", "1px solid #7ed998")
        .style("color", "#fff")
        .style("padding", "4px 10px")
        .style("border-radius", "15px")
        .style("font-size", "14px")
        .style("cursor", "pointer")
        .style("user-select", "none")
        .attr("title", "Click to remove");
    
    tagsEnter.text(d => d);
    
    tagsEnter.append("span")
        .text(" ✕")
        .style("font-weight", "bold")
        .style("margin-left", "6px")
        .style("color", "#ff6b6b");
    
    // Click to remove
    tagsEnter.on("click", function(e, d) {
        activeCompanies = activeCompanies.filter(c => c !== d);
        renderTags();
        updateVisualization();
    });
}



/**
 * Prepare movie data by parsing and converting types
 */
function prepareMovies(rows) {
    const parseList = (v) => {
        if (Array.isArray(v)) return v.map(s => String(s).trim());
        if (v == null) return [];
        const s = String(v).trim();
        if ((s.startsWith("[") && s.endsWith("]")) || (s.startsWith("{") && s.endsWith("}"))) {
            try {
                const arr = JSON.parse(s);
                if (Array.isArray(arr)) return arr.map(x => String(x).trim());
            } catch (e) {}
        }
        // return s === "" ? [] : s.split("|").map(x => x.trim()).filter(Boolean);
        return s === "" ? [] : s.split(/,|\|/).map(x => x.trim()).filter(Boolean);
    };
    
    rows.forEach(d => {
        d.id = +d.id;
        d.vote_average  = +d.vote_average;
        d.vote_count    = +d.vote_count;
        d.release_date  = d.release_date ? new Date(d.release_date) : null;
        d.revenue       = +d.revenue;
        d.runtime       = +d.runtime;
        d.budget        = +d.budget;
        d.popularity    = +d.popularity;
        d.genres                = parseList(d.genres);
        d.production_companies  = parseList(d.production_companies);
    });
    return rows;
}

/**
 * Build flowers data structure from companies and movies
 *
 * Returns flowers in the structure of:
 * [
 *     {company: ..., total: total number of genres, petals: [{genre: genreName, score: normalized average popularity of the genres}, ...]},
 * ]
 */
function buildFlowers(companyList, movies) {
    const norm = s => s.toLowerCase().trim();
    const wanted = new Map(companyList.map(c => [norm(c), c])); // norm => 原名
    
    const acc = new Map(companyList.map(c => [c, { total: 0, genreCount: new Map() }]));
    
    for (const m of movies) {
        if (!m.production_companies || m.production_companies.length === 0) continue;
        const genres = (m.genres && m.genres.length) ? m.genres : [];
        for (const compRaw of m.production_companies) {
            const key = norm(compRaw);
            const canonical = wanted.get(key);
            if (!canonical) continue;
            const obj = acc.get(canonical);
            obj.total += 1;
            for (const g of genres) {
                obj.genreCount.set(g, (obj.genreCount.get(g) || 0) + 1);
            }
        }
    }
    
    const flowers = [];
    for (const company of companyList) {
        const { total, genreCount } = acc.get(company);
        const totalGenres = Array.from(genreCount.values()).reduce((a, b) => a + b, 0);
        
        let petals = [];
        if (totalGenres > 0) {
            for (const [genre, cnt] of genreCount.entries()) {
                const share = cnt / totalGenres;             // [0,1]
                const score = share * 2 - 1;                 // [-1,1]
                petals.push({ genre, score });
            }
            petals.sort((a, b) => d3.descending(a.score, b.score));
            petals = petals.slice(0, 10); // restrict number of petals for usability purposes
        }
        
        flowers.push({ company, total, petals });
    }
    
    return flowers;
}

/**
 * Draw the flowers visualization
 */
function drawFlowers(flowers) {
    // Get container dimensions for responsive sizing
    const container = d3.select("#garden").node();
    let containerWidth = 1100;
    let containerHeight = 560;
    
    if (container) {
        containerWidth = container.clientWidth || container.offsetWidth || window.innerWidth - 40;
        containerHeight = container.clientHeight || container.offsetHeight || 560;
    } else if (window.innerWidth) {
        containerWidth = Math.min(window.innerWidth - 40, 1100);
    }
    
    containerWidth = Math.min(containerWidth, 1100);
    containerWidth = Math.max(300, containerWidth); // Minimum width
    containerHeight = Math.max(400, containerHeight); // Minimum height
    
    // Responsive dimensions
    const W = containerWidth;
    const H = Math.max(400, Math.min(containerHeight, W * 0.51)); // Maintain aspect ratio
    
    // Responsive margins
    const isMobile = W < 600;
    const margin = {
        top: isMobile ? 50 : 80,
        right: isMobile ? 20 : 40,
        bottom: isMobile ? 60 : 80,
        left: isMobile ? 40 : 60
    };
    
    // Add tooltip
    d3.select(".flower-tooltip").remove();
    const tooltip = d3.select("body").append("div")
        .attr("class", "flower-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(0, 0, 0, 0.85)")
        .style("color", "#fff")
        .style("padding", "8px 12px")
        .style("border-radius", "6px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "9999")
        .style("border", "1px solid rgba(255,255,255,0.2)");
    
    // Clear any existing SVG
    d3.select("#garden").select("svg").remove();
    
    const svg = d3.select("#garden").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${W} ${H}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("max-width", "1100px")
        .style("min-height", "400px");
    
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;
    
    // ==== Scales and axes ====
    // x：companies in alphabetical order
    const x = d3.scalePoint()
        .domain(flowers.map(d => d.company).sort(d3.ascending))
        .range([0, innerW]).padding(0.5);
    
    // stem height: total number of works
    const stemH = d3.scaleLog()
        .domain([1, d3.max(flowers, d => d.total) + 1]).nice()
        .range([40, innerH - 80]);
    
    // color: by genre popularity
    // const color = d3.scaleDiverging()
    //     .domain([-1, 0, 1])
    //     .interpolator(t => d3.interpolatePRGn(t));
    // const color = d3.scaleOrdinal(d3.schemeTableau10);
    // const color = d3.scaleOrdinal([...d3.schemeTableau10, ...d3.schemeSet3]);
    
    const allGenres = Array.from(new Set(flowers.flatMap(d => d.petals.map(p => p.genre)))).sort();
    const distinctColors = d3.quantize(d3.interpolateSpectral, allGenres.length + 1);
    const color = d3.scaleOrdinal()
        .domain(allGenres)
        .range(distinctColors);
    
    // Customize petal size by number of petals
    const petalWidth = (k) => d3.scaleLinear().domain([3, 12]).range([10, 20])(k);
    const petalLen   = (k) => d3.scaleLinear().domain([3, 12]).range([35, 65])(k);
    
    // ==== company names ====
    const axisFontSize = isMobile ? "12px" : "16px";
    g.append("g").attr("transform", `translate(0,${innerH})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("dy", "1.25em")
        .style("font-family", "bitregular")
        .style("font-size", axisFontSize);
    
    // // y axis as number of works
    // g.append("g")
    //     .call(d3.axisLeft(stemH).ticks(5))
    //     .selectAll("text").style("font-size","11px");
    
    const titleFontSize = isMobile ? "14px" : "18px";
    const labelFontSize = isMobile ? "11px" : "14px";
    
    g.append("text")
        .attr("x", innerW/2).attr("y", isMobile ? -20 : -30)
        .attr("text-anchor", "middle")
        .style("font-size", titleFontSize)
        .style("font-weight", 700)
        .text("Production Company and the Genres They Explored as Flowers")
        .style("fill", "#ffffff");
    
    g.append("text")
        .attr("transform","rotate(-90)")
        .attr("x", -innerH/2).attr("y", isMobile ? -30 : -40)
        .attr("text-anchor","middle")
        .style("fill","#ffffff")
        .style("font-size", labelFontSize)
        .text("# of works (stem height)");
    
    // Flower containers
    const flowerG = g.selectAll(".flower")
        .data(flowers.sort((a,b)=>d3.ascending(a.company,b.company)))
        .join("g")
        .attr("class","flower")
        .attr("transform", d => `translate(${x(d.company)}, ${innerH})`);
    
    // Draw stems
    flowerG.append("line")
        .attr("y1", 0)
        .attr("y2", d => -stemH(d.total))
        .attr("stroke", "#7ed998")
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round");
    
    // Flower petals
    flowerG.each(function(d){
        const k = d.petals.length;
        const baseY = -stemH(d.total);
        const rx = petalWidth(k), ry = petalLen(k);
        const group = d3.select(this).append("g").attr("transform",`translate(0,${baseY})`);
        d.petals.forEach((p, i) => {
            const angle = (i / k) * 360;
            const originalFill = color(p.genre);
            const originalStroke = d3.color(originalFill).darker(0.8);
            
            const petal = group.append("ellipse")
                .attr("class", "flower-petal")
                .attr("data-genre", p.genre)
                .attr("cx", 0).attr("cy", -ry*0.7)
                .attr("rx", rx).attr("ry", ry)
                .attr("transform", `rotate(${angle})`)
                .attr("fill", originalFill)
                .attr("fill-opacity", 1)
                .attr("stroke", originalStroke)
                .attr("stroke-width", 1);
            
            petal.append("title").text(`${p.genre}: score ${p.score.toFixed(2)}`);
            
            // tooltip interactions
            petal.on("mouseover", function(event) {
                
                const hoveredGenre = p.genre;
                
                // dim all petals
                d3.selectAll(".flower-petal")
                    .style("opacity", 0.2);
                
                // restore opacity of petals of the same genre
                d3.selectAll(`.flower-petal[data-genre="${hoveredGenre}"]`)
                    .style("opacity", 1)
                    .attr("stroke-width", 1.5);
                
                // highlight the hovered petal
                d3.select(this)
                    .style("opacity", 1)
                    .attr("stroke", "#ffffff")
                    .attr("stroke-width", 2);
                
                tooltip.style("visibility", "visible")
                    .html(`<strong>${p.genre}</strong><br>Pop Score: ${p.score.toFixed(2)}`);
            })
                .on("mousemove", function(event) {
                    tooltip.style("top", (event.pageY - 10) + "px")
                        .style("left", (event.pageX + 15) + "px");
                })
                .on("mouseout", function() {
                    d3.selectAll(".flower-petal")
                        .style("opacity", 1)
                        .attr("stroke-width", 1)
                        .attr("stroke", function() {
                            const g = d3.select(this).attr("data-genre");
                            const c = color(g);
                            return d3.color(c).darker(0.8);
                        });
                    
                    tooltip.style("visibility", "hidden");
                });
            
        });
    });
    
    // Flower centers
    flowerG.append("circle")
        .attr("cy", d => -stemH(d.total))
        .attr("r", 12)
        .attr("fill", "#ffffff").attr("stroke","#b98a1e");
    
    // Helper to subtly highlight petals belonging to the selected genre,
    // without dimming any other petals.
    function applyFlowerHighlight(selectedGenre) {
        const mapped = mapGenreForFlowers(selectedGenre);
        
        const petals = svg.selectAll(".flower-petal");
        
        // Reset all petals
        petals
            .attr("stroke-width", 1)
            .style("filter", "none");
        
        if (!mapped) return;
        
        // Highlight petals whose genre matches the mapped genre
        petals
            .filter(function() {
                return d3.select(this).attr("data-genre") === mapped;
            })
            .attr("stroke-width", 2.2)
            .style("filter", "drop-shadow(0 0 8px rgba(255, 218, 106, 0.9))");
    }
    
    // Draw pop score formula
    const formulaY = innerH + (isMobile ? 40 : 50);
    
    const formulaText = g.append("text")
        .attr("class", "formula-label")
        .attr("x", innerW / 2)
        .attr("y", formulaY)
        .attr("text-anchor", "middle")
        .style("font-family", "'Courier New', monospace")
        .style("font-size", "12px")
        .style("fill", "rgba(255, 255, 255, 1)");
    
    formulaText.append("tspan").text("Pop Score = ( ");
    
    formulaText.append("tspan")
        .text("Genre Count")
        // .style("fill", "#ff9e9e")
        .style("fill", "rgba(255, 255, 255, 1)")
        .style("font-weight", "bold");
    
    formulaText.append("tspan").text(" / ");
    
    formulaText.append("tspan")
        .text("Total Works")
        // .style("fill", "#7ed998")
        .style("fill", "rgba(255, 255, 255, 1)")
        .style("font-weight", "bold");
    
    formulaText.append("tspan").text(" ) × 2 - 1");
    
    // Expose a global hook so other parts of the page can trigger flower highlighting.
    window.highlightFlowerGenre = function(selectedGenre) {
        applyFlowerHighlight(selectedGenre);
    };
    
    // If the user already picked a genre before the flowers finished loading,
    // apply that highlight immediately.
    if (window.selectedGenre) {
        applyFlowerHighlight(window.selectedGenre);
    }
}

window.handleAddCompany = function() {
    const input = document.getElementById("company-search");
    const val = input.value.trim();
    
    if (!val) return;
    
    // 0. Restrict number of active companies to 5
    if (activeCompanies.length >= 5) {
        alert("Garden is full! Maximum 5 studios allowed.\n(Please remove one first to add more.)");
        return;
    }
    
    // 1. Check if company is already in the active list
    if (activeCompanies.includes(val)) {
        alert("This studio is already in the garden!");
        input.value = "";
        return;
    }
    
    // 2. Check if the company has at least some movies in the dataset
    activeCompanies.push(val);
    input.value = "";
    
    renderTags();
    updateVisualization();
};

document.getElementById("company-search")?.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        window.handleAddCompany();
    }
});

// Initialize on load
loadFlowersData();

