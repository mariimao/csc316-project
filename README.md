# csc316-project

Data was pulled on: 2025-10-07

> ⚠️ This repository uses [Git LFS](https://git-lfs.com).  
> Please run `git lfs install` before cloning or pulling to ensure large files are downloaded correctly.


# Netflix top 10
- https://www.netflix.com/tudum/top10
## 2025-10-07_global_alltime.tsv (global lists)
| week       | category        | weekly_rank | show_title          | season_title | weekly_hours_viewed | runtime | weekly_views | cumulative_weeks_in_top_10 |
|-------------|-----------------|--------------|----------------------|---------------|----------------------|----------|---------------|-----------------------------|
| 2025-10-05  | Films (English) | 1            | KPop Demon Hunters   | N/A           | 30,200,000           | 1.6667   | 18,100,000    | 16                          |
| 2025-10-05  | Films (English) | 2            | Ruth & Boaz          | N/A           | 21,900,000           | 1.55     | 14,100,000    | 2                           |


## 2025-10-07_global_weekly.tsv (country lists)
| country_name | country_iso2 | week       | category | weekly_rank | show_title                                   | season_title | cumulative_weeks_in_top_10 |
|---------------|--------------|------------|-----------|--------------|----------------------------------------------|---------------|-----------------------------|
| Argentina     | AR           | 2025-10-05 | Films     | 1            | French Lover                                | N/A           | 2                           |
| Argentina     | AR           | 2025-10-05 | Films     | 2            | Rockstar Duki from the end of the world      | N/A           | 1                           |


## 2025-10-07_country_weekly.tsv (most popular lists)
| category        | rank | show_title         | season_title | hours_viewed_first_91_days | runtime | views_first_91_days |
|------------------|------|--------------------|---------------|-----------------------------|----------|----------------------|
| Films (English)  | 1    | KPop Demon Hunters | N/A           | 541,800,000                 | 1.6667   | 325,100,000          |
| Films (English)  | 2    | Red Notice         | N/A           | 454,200,000                 | 1.9667   | 230,900,000          |


# IMDB
- https://datasets.imdbws.com

> (Files are too big to use on github so you will need to decompress them locally)

## title.akas.tsv.gz
| titleId   | ordering | title       | region | language | types       | attributes    | isOriginalTitle |
|------------|----------|-------------|--------|-----------|--------------|---------------|-----------------|
| tt0000001  | 1        | Carmencita  | \N     | \N        | original     | \N            | 1               |
| tt0000001  | 2        | Carmencita  | DE     | \N        | \N           | literal title | 0               |

## title.basics.tsv.gz
| tconst     | titleType | primaryTitle             | originalTitle           | isAdult | startYear | endYear | runtimeMinutes | genres              |
|-------------|------------|--------------------------|--------------------------|----------|------------|---------|----------------|----------------------|
| tt0000001   | short      | Carmencita              | Carmencita              | 0        | 1894       | \N      | 1              | Documentary,Short    |
| tt0000002   | short      | Le clown et ses chiens  | Le clown et ses chiens  | 0        | 1892       | \N      | 5              | Animation,Short      |

## title.ratings.tsv.gz
| tconst     | averageRating | numVotes |
|-------------|----------------|-----------|
| tt0000001   | 5.7            | 2179      |
| tt0000002   | 5.5            | 301       |


# TMDB
- https://www.kaggle.com/datasets/asaniczka/tmdb-movies-dataset-2023-930k-movies
- https://www.kaggle.com/datasets/asaniczka/full-tmdb-tv-shows-dataset-2023-150k-shows

## TMDB_movie_dataset_v11.tsv
| id     | title        | vote_average | vote_count | status   | release_date | revenue   | runtime | adult | backdrop_path                              | budget     | homepage                                      | imdb_id    | original_language | original_title | overview | popularity | poster_path                              | tagline                                       | genres                                 | production_companies                          | production_countries                          | spoken_languages                          | keywords |
|---------|--------------|--------------|-------------|-----------|---------------|------------|----------|--------|---------------------------------------------|-------------|------------------------------------------------|-------------|-------------------|----------------|-----------|-------------|---------------------------------------------|------------------------------------------------|----------------------------------------|------------------------------------------------|------------------------------------------------|--------------------------------------------|-----------|
| 27205  | Inception     | 8.364        | 34495       | Released  | 2010-07-15    | 825532764  | 148      | False  | /8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg           | 160000000  | https://www.warnerbros.com/movies/inception   | tt1375666  | en                | Inception      | Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person's idea into a target's subconscious. | 83.952      | /oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg           | Your mind is the scene of the crime.          | Action, Science Fiction, Adventure      | Legendary Pictures, Syncopy, Warner Bros. Pictures | United Kingdom, United States of America       | English, French, Japanese, Swahili           | rescue, mission, dream, airplane, paris, france, virtual reality, kidnapping, philosophy, spy, allegory, manipulation, car crash, heist, memory, architecture, los angeles, california, dream world, subconscious |
| 157336 | Interstellar  | 8.417        | 32571       | Released  | 2014-11-05    | 701729206  | 169      | False  | /pbrkL804c8yAv3zBZR4QPEafpAR.jpg           | 165000000  | http://www.interstellarmovie.net/            | tt0816692  | en                | Interstellar   | The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage. | 140.241     | /gEU2QniE6E77NI6lCU6MxlNBvIx.jpg           | Mankind was born on Earth. It was never meant to die here. | Adventure, Drama, Science Fiction      | Legendary Pictures, Syncopy, Lynda Obst Productions | United Kingdom, United States of America       | English                                    | rescue, future, spacecraft, race against time, artificial intelligence (a.i.), nasa, time warp, dystopia, expedition, space travel, wormhole, famine, black hole, quantum mechanics, family relationships, space, robot, astronaut, scientist, single father, farmer, space station, curious, space adventure, time paradox, thoughtful, time-manipulation, father daughter relationship, 2060s, cornfield, time manipulation, complicated |


## TMDB_tv_datset_v3.tsv
| id     | name            | number_of_seasons | number_of_episodes | original_language | vote_count | vote_average | overview | adult | backdrop_path                              | first_air_date | last_air_date | homepage                                  | in_production | original_name    | popularity  | poster_path                              | type     | status | tagline            | genres                           | created_by             | languages | networks            | origin_country | spoken_languages | production_companies                                                | production_countries                        | episode_run_time |
|--------|-----------------|------------------|------------------|------------------|------------|--------------|---------|-------|--------------------------------------------|----------------|---------------|-------------------------------------------|----------------|-----------------|------------|--------------------------------------------|----------|--------|------------------|---------------------------------|------------------------|-----------|--------------------|----------------|-----------------|---------------------------------------------------------------------|--------------------------------------------|----------------|
| 1399   | Game of Thrones | 8                | 73               | en               | 21857      | 8.442        | Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night's Watch, is all that stands between the realms of men and icy horrors beyond. | False | /2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg | 2011-04-17     | 2019-05-19    | http://www.hbo.com/game-of-thrones     | False          | Game of Thrones | 1083.917  | /1XS1oqL89opfnbLl8WnZY1O1uJx.jpg       | Scripted | Ended  | Winter Is Coming   | Sci-Fi & Fantasy, Drama, Action & Adventure | David Benioff, D.B. Weiss | en        | HBO                | US             | English         | Revolution Sun Studios, Television 360, Generator Entertainment, Bighead Littlehead | United Kingdom, United States of America   | 0              |
| 71446  | Money Heist     | 3                | 41               | es               | 17836      | 8.257        | To carry out the biggest heist in history, a mysterious man called The Professor recruits a band of eight robbers who have a single characteristic: none of them has anything to lose. Five months of seclusion - memorizing every step, every detail, every probability - culminate in eleven days locked up in the National Coinage and Stamp Factory of Spain, surrounded by police forces and with dozens of hostages in their power, to find out whether their suicide wager will lead to everything or nothing. | False | /gFZriCkpJYsApPZEF3jhxL4yLzG.jpg | 2017-05-02     | 2021-12-03    | https://www.netflix.com/title/80192098 | False          | La Casa de Papel | 96.354    | /reEMJA1uzscCbkpeRJeTT2bjqUp.jpg       | Scripted | Ended  | The perfect robbery. | Crime, Drama                       | Álex Pina              | es        | Netflix, Antena 3   | ES             | Español         | Vancouver Media                                                    | Spain                                      | 70             |

