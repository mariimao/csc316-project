function loadData() {
    d3.tsv("tmdb/TMDB_movie_dataset_v11.tsv", (data) => {
        let tmdbMovies = prepareDataForTMDBMovies(data);
    })
}

// Helper function to prepare data for tmdb/TMDB_movie_dataset_v11.tsv
function prepareDataForTMDBMovies(data) {
    data.forEach(d => {
        // id	title	vote_average	vote_count	(-)status	release_date	revenue	runtime	(-)adult	(-)backdrop_path	budget
        // homepage	(-)imdb_id	original_language	(-)original_title	(-)overview	popularity	poster_path	(-)tagline	genres
        // production_companies	production_countries	spoken_languages	keywords
        d.id = +d.id;
        // d.title
        d.vote_average = +d.vote_average;
        d.vote_count = +d.vote_count;
        // dropped d.status
        d.release_date = d.release_date ? new Date(d.release_date) : null;
        d.revenue = +d.revenue;
        d.runtime = +d.runtime;
        // dropped adult
        // dropped backdrop_path
        d.budget = +d.budget;
        // d.homepage
        // dropped imdb_id
        // d.original_language
        // dropped original_title
        // dropped overview
        d.popularity = +d.popularity;
        // d.poster_path
        // dropped tagline
        // d.genres
        // d.production_companies
        // d.production_countries
        // d.spoken_languages
        // d.keywords
    });
    return data;
}

function prepareDataForTMDBShows(data) {
    data.forEach(d => {
        // id	name	number_of_seasons	number_of_episodes	original_language	vote_count	vote_average	(-)overview	(-)adult
        // (-)backdrop_path	first_air_date	last_air_date	homepage	(-)in_production	(-)original_name	popularity
        // poster_path	type	(-)status	(-)tagline	genres	created_by	languages	networks	origin_country	spoken_languages
        // production_companies	production_countries	episode_run_time
        d.id = +id;
        // d.name
        d.number_of_seasons = +d.number_of_seasons;
        d.number_of_episodes = +d.number_of_episodes;
        // d.original_language
        d.vote_count = +d.vote_count;
        d.vote_average = +d.vote_average;
        // drop overview
        // drop adult
        // drop backdrop_path
        d.first_air_date = d.first_air_date ? new Date(d.first_air_date) : null;
        d.last_air_date = d.last_air_date ? new Date(d.last_air_date) : null;
        // d.homepage
        // drop in_production
        // drop original_name
        d.popularity = +d.popularity;
        // d.poster_path
        // d.type
        // drop status
        // drop tagline
        // d.genres
        // d.created_by
        // d.languages
        // d.networks
        // d.origin_country
        // d.spoken_languages
        // d.production_companies
        // d.production_countries
        d.episode_run_time = +d.episode_run_time;
    })
    return data;
}