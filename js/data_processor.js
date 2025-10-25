// Assisted by ChatGPT 5

let tmdbMovies = [];

function loadData() {
    d3.tsv("tmdb/tmdb_movies_reduced.tsv", d3.autoType)
        .then(raw => {
            tmdbMovies = prepareMovies(raw);
            console.log("movies:", tmdbMovies.length);
            // Placeholder companies (this data should come from user's choice)
            const companies = ["Marvel Studios", "Warner Bros. Pictures", "Paramount"];
            const flowers = buildFlowers(companies, tmdbMovies);
            console.log(flowers);
            drawFlowers(flowers)
        })
        .catch(console.error);
}

// Prepare movie data
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

/*
Return flowers in the structure of
[
    {company: ..., total: total number of genres, petals: [{genre: genreName, score: normalized average popularity of the genres}, ...]},
]
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

loadData();