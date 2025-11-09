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

/**
 * Load movie data and initialize the flowers visualization
 */
function loadFlowersData() {
    d3.tsv("data/tmdb/tmdb_movies_reduced.tsv", d3.autoType)
        .then(raw => {
            tmdbMovies = prepareMovies(raw);
            console.log("movies:", tmdbMovies.length);
            // Placeholder companies (this data should come from user's choice)
            const companies = ["Marvel Studios", "Warner Bros. Pictures", "Paramount"];
            const flowers = buildFlowers(companies, tmdbMovies);
            console.log(flowers);
            drawFlowers(flowers);
        })
        .catch(console.error);
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
        return s === "" ? [] : s.split("|").map(x => x.trim()).filter(Boolean);
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
    const W = 1100, H = 560, margin = {top: 80, right: 40, bottom: 80, left: 60};
    const svg = d3.select("#garden").append("svg")
        .attr("width", W).attr("height", H);
    
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
    const color = d3.scaleDiverging()
        .domain([-1, 0, 1])
        .interpolator(t => d3.interpolatePRGn(t));

    // Customize petal size by number of petals
    const petalWidth = (k) => d3.scaleLinear().domain([3, 12]).range([10, 20])(k);
    const petalLen   = (k) => d3.scaleLinear().domain([3, 12]).range([35, 65])(k);

    // ==== company names ====
    g.append("g").attr("transform", `translate(0,${innerH})`)
        .call(d3.axisBottom(x))
        .selectAll("text").attr("dy", "1.25em").attr("font-size", "16px");

    // // y axis as number of works
    // g.append("g")
    //     .call(d3.axisLeft(stemH).ticks(5))
    //     .selectAll("text").style("font-size","11px");
    
    g.append("text")
        .attr("x", innerW/2).attr("y", -30)
        .attr("text-anchor", "middle")
        .style("font-size","18px").style("font-weight",700)
        .text("Production Company and the Genres They Explored as Flowers");
    
    g.append("text")
        .attr("transform","rotate(-90)")
        .attr("x", -innerH/2).attr("y", -40)
        .attr("text-anchor","middle").style("fill","#666")
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
        .attr("stroke", "#333")
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
            group.append("ellipse")
                .attr("cx", 0).attr("cy", -ry*0.7)
                .attr("rx", rx).attr("ry", ry)
                .attr("transform", `rotate(${angle})`)
                .attr("fill", color(p.score))
                .attr("fill-opacity", 0.85)
                .attr("stroke", d3.color(color(p.score)).darker(0.8))
                .attr("stroke-width", 1)
                .append("title").text(`${p.genre}: score ${p.score.toFixed(2)}`);
        });
    });

    // Flower centers
    flowerG.append("circle")
        .attr("cy", d => -stemH(d.total))
        .attr("r", 12)
        .attr("fill", "#ffffff").attr("stroke","#b98a1e");
}

// Initialize on load
loadFlowersData();

