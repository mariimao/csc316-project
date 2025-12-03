# CSC316 Project: Battle of the Genres

Project can be accessed here: https://mariimao.github.io/csc316-project/

[Demo video](https://drive.google.com/file/d/1exada7YGlKzDvxtC18_nx6f63DOEssug/view?usp=sharing)

## Dataset Sources
Data was pulled on: 2025-10-07
> ⚠️ This repository uses [Git LFS](https://git-lfs.com).  
> Please run `git lfs install` before cloning or pulling to ensure large files are downloaded correctly.

Our project uses datasets from two major data sources: Netflix and TMDB.
### Netflix Top 10 Dataset
Source: https://www.netflix.com/tudum/top10

Netflix provides three types of ranking data:
- Global alltime charts (used to analyze the total views for each show globally)
- Country weekly charts (used to analyze each country's favorite shows)
- Most popular lists
#### Data format: Attributes & Example rows
##### 2025-10-07_global_alltime.tsv (global lists)
| week       | category        | weekly_rank | show_title          | season_title | weekly_hours_viewed | runtime | weekly_views | cumulative_weeks_in_top_10 |
|-------------|-----------------|--------------|----------------------|---------------|----------------------|----------|---------------|-----------------------------|
| 2025-10-05  | Films (English) | 1            | KPop Demon Hunters   | N/A           | 30,200,000           | 1.6667   | 18,100,000    | 16                          |
| 2025-10-05  | Films (English) | 2            | Ruth & Boaz          | N/A           | 21,900,000           | 1.55     | 14,100,000    | 2                           |


##### 2025-10-07_global_weekly.tsv (country lists)
| country_name | country_iso2 | week       | category | weekly_rank | show_title                                   | season_title | cumulative_weeks_in_top_10 |
|---------------|--------------|------------|-----------|--------------|----------------------------------------------|---------------|-----------------------------|
| Argentina     | AR           | 2025-10-05 | Films     | 1            | French Lover                                | N/A           | 2                           |
| Argentina     | AR           | 2025-10-05 | Films     | 2            | Rockstar Duki from the end of the world      | N/A           | 1                           |


##### 2025-10-07_country_weekly.tsv (most popular lists)
| category        | rank | show_title         | season_title | hours_viewed_first_91_days | runtime | views_first_91_days |
|------------------|------|--------------------|---------------|-----------------------------|----------|----------------------|
| Films (English)  | 1    | KPop Demon Hunters | N/A           | 541,800,000                 | 1.6667   | 325,100,000          |
| Films (English)  | 2    | Red Notice         | N/A           | 454,200,000                 | 1.9667   | 230,900,000          |

### TMDB
Sources:
- https://www.kaggle.com/datasets/asaniczka/tmdb-movies-dataset-2023-930k-movies (Movie data)
- https://www.kaggle.com/datasets/asaniczka/full-tmdb-tv-shows-dataset-2023-150k-shows (TV Show data)
#### Data format: Attributes & Example rows
##### TMDB_movie_dataset_v11.tsv (data for Movies)
| id     | title        | vote_average | vote_count | status   | release_date | revenue   | runtime | adult | backdrop_path                              | budget     | homepage                                      | imdb_id    | original_language | original_title | overview | popularity | poster_path                              | tagline                                       | genres                                 | production_companies                          | production_countries                          | spoken_languages                          | keywords |
|---------|--------------|--------------|-------------|-----------|---------------|------------|----------|--------|---------------------------------------------|-------------|------------------------------------------------|-------------|-------------------|----------------|-----------|-------------|---------------------------------------------|------------------------------------------------|----------------------------------------|------------------------------------------------|------------------------------------------------|--------------------------------------------|-----------|
| 27205  | Inception     | 8.364        | 34495       | Released  | 2010-07-15    | 825532764  | 148      | False  | /8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg           | 160000000  | https://www.warnerbros.com/movies/inception   | tt1375666  | en                | Inception      | Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person's idea into a target's subconscious. | 83.952      | /oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg           | Your mind is the scene of the crime.          | Action, Science Fiction, Adventure      | Legendary Pictures, Syncopy, Warner Bros. Pictures | United Kingdom, United States of America       | English, French, Japanese, Swahili           | rescue, mission, dream, airplane, paris, france, virtual reality, kidnapping, philosophy, spy, allegory, manipulation, car crash, heist, memory, architecture, los angeles, california, dream world, subconscious |
##### TMDB_tv_datset_v3.tsv (data for TV shows)
| id     | name            | number_of_seasons | number_of_episodes | original_language | vote_count | vote_average | overview | adult | backdrop_path                              | first_air_date | last_air_date | homepage                                  | in_production | original_name    | popularity  | poster_path                              | type     | status | tagline            | genres                           | created_by             | languages | networks            | origin_country | spoken_languages | production_companies                                                | production_countries                        | episode_run_time |
|--------|-----------------|------------------|------------------|------------------|------------|--------------|---------|-------|--------------------------------------------|----------------|---------------|-------------------------------------------|----------------|-----------------|------------|--------------------------------------------|----------|--------|------------------|---------------------------------|------------------------|-----------|--------------------|----------------|-----------------|---------------------------------------------------------------------|--------------------------------------------|----------------|
| 1399   | Game of Thrones | 8                | 73               | en               | 21857      | 8.442        | Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night's Watch, is all that stands between the realms of men and icy horrors beyond. | False | /2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg | 2011-04-17     | 2019-05-19    | http://www.hbo.com/game-of-thrones     | False          | Game of Thrones | 1083.917  | /1XS1oqL89opfnbLl8WnZY1O1uJx.jpg       | Scripted | Ended  | Winter Is Coming   | Sci-Fi & Fantasy, Drama, Action & Adventure | David Benioff, D.B. Weiss | en        | HBO                | US             | English         | Revolution Sun Studios, Television 360, Generator Entertainment, Bighead Littlehead | United Kingdom, United States of America   | 0              |

## Overview of Project Code
<!-- The README file must give an overview of what you are handing in: which parts are your code, 
which parts are libraries, and so on. -->
### Project Directory Structure

*   **`/data/`**: Contains the processed datasets used in our visualizations, including Netflix and TMDB datasets.
*   **`/js/`**: Includes all D3 visualizations as well as interaction handlers (like the cursor).
*   **`/css/`**: Contains all CSS styles used for page layout and visualizations.
*   **`/assets/`**: Contains all media files, such as animations, animated characters and background image
*   **`index.html`**: The main webpage structure of the project.
*   **`README.md`**: Project documentation for the project you are reading now.

This project is built based on standard web technologies - HTML, CSS, and Javascript - and 
utilizes the D3.js library for data visualization tasks.

All css, js, and html files are code written by the project members with the assistance of Generative AI including
ChatGPT and Gemini. No further libraries are used except D3.

Image assets under `/assets/` are non-commercial resources from free repositories.

## Guide to Usage
<!-- Explain non-obvious features of our interface -->

Run the project by opening `index.html` in a web browser, preferably Google Chrome or Firefox.

### Connected Scatter Plot (Genre Popularity Over Time)
- Hover on any data point to view the specific number of shows in that genre for that year.
- Click on a color block in the legend to hide or display any line corresponding to that genre.
- The chosen documentary is highlighted in the legend.

### Flower Visualization (Production Company and the Genres ...)
- Each flower represents a production company, with the petals indicating the top 10 genres they chose.
- The proportion of each genre decreases as you move clockwise, where the upright petal represents the most chosen genre.
- Use the selection box at the top to choose or type in a production company. Companies are listed in alphabetical order.
Can select at most 5 companies.
- Hover over any petal to see the petals corresponding to that genre for all flowers, if applicable.
Petals corresponding to the same genre have the same color.
- Hover over the center of each flower to see the total number of works used to calculate the proportions
for each company.

### Interactive Popcorn Visualization (How to use it to get a movie/show recommendation)
1. Start the Pop: Click the Pop! button to start the pop animation.
2. Once the popcorns are generated, click on a piece of popcorn to get a random movie or show recommendation associated with that genre.
3. Reset: Click the Reset button to clear the visualization and rerun the recommendation.
