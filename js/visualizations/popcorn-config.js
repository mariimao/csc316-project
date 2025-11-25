popcorn-viz.js// Configuration for Popcorn Kernel Burst visualization

const GENRE_COLORS = {
    'Drama': '#D4A574',
    'Romance': '#E89BA3',
    'Action': '#8B9E83',
    'Comedy': '#E8C170',
    'Thriller': '#9B8B7E',
    'Sci-Fi': '#7B9EA8',
    'Horror': '#A77B5B',
    'Documentary': '#9370DB'
};

// Sample data - replace with your Netflix data
const GENRE_DATA = [
    { genre: 'Drama', popularity: 92, shows: 45, avgRating: 8.5 },
    { genre: 'Comedy', popularity: 85, shows: 38, avgRating: 8.2 },
    { genre: 'Action', popularity: 88, shows: 42, avgRating: 8.4 },
    { genre: 'Thriller', popularity: 79, shows: 35, avgRating: 8.1 },
    { genre: 'Romance', popularity: 83, shows: 30, avgRating: 7.9 },
    { genre: 'Horror', popularity: 76, shows: 28, avgRating: 7.8 },
    { genre: 'Sci-Fi', popularity: 81, shows: 32, avgRating: 8.3 },
    { genre: 'Documentary', popularity: 72, shows: 25, avgRating: 8.6 }
];

const ANIMATION_CONFIG = {
    popDuration: 800,
    popDelay: 150,
    kernelSize: 12,
    maxPopHeight: 400
};

// Movie recommendations for fortune cookie feature
const MOVIE_RECOMMENDATIONS = {
    'Drama': [
        { title: 'The Shawshank Redemption', year: 1994, tagline: 'Hope springs eternal' },
        { title: 'Parasite', year: 2019, tagline: 'Class warfare masterpiece' },
        { title: 'Moonlight', year: 2016, tagline: 'Coming-of-age poetry' },
        { title: 'The Godfather', year: 1972, tagline: 'An offer you cannot refuse' }
    ],
    'Comedy': [
        { title: 'Grand Budapest Hotel', year: 2014, tagline: 'Whimsical adventure awaits' },
        { title: 'Superbad', year: 2007, tagline: 'One night of chaos' },
        { title: 'Knives Out', year: 2019, tagline: 'Murder mystery laughs' },
        { title: 'Bridesmaids', year: 2011, tagline: 'Friendship and mayhem' }
    ],
    'Action': [
        { title: 'Mad Max: Fury Road', year: 2015, tagline: 'Witness the chaos' },
        { title: 'John Wick', year: 2014, tagline: 'Never mess with his dog' },
        { title: 'The Dark Knight', year: 2008, tagline: 'Why so serious?' },
        { title: 'Inception', year: 2010, tagline: 'Dreams within dreams' }
    ],
    'Thriller': [
        { title: 'Se7en', year: 1995, tagline: 'Whats in the box?' },
        { title: 'Gone Girl', year: 2014, tagline: 'Marriage thriller supreme' },
        { title: 'Prisoners', year: 2013, tagline: 'How far would you go?' },
        { title: 'Zodiac', year: 2007, tagline: 'The case that haunts' }
    ],
    'Romance': [
        { title: 'Before Sunrise', year: 1995, tagline: 'One night in Vienna' },
        { title: 'Eternal Sunshine of the Spotless Mind', year: 2004, tagline: 'Love and memory intertwined' },
        { title: 'La La Land', year: 2016, tagline: 'Dreams and romance collide' },
        { title: 'Pride and Prejudice', year: 2005, tagline: 'Classic love story' }
    ],
    'Horror': [
        { title: 'Hereditary', year: 2018, tagline: 'Family secrets unravel' },
        { title: 'The Witch', year: 2015, tagline: 'Live deliciously' },
        { title: 'Get Out', year: 2017, tagline: 'Stay woke at all costs' },
        { title: 'It Follows', year: 2014, tagline: 'It never stops coming' }
    ],
    'Sci-Fi': [
        { title: 'Blade Runner 2049', year: 2017, tagline: 'What makes us human?' },
        { title: 'Arrival', year: 2016, tagline: 'Time is not linear' },
        { title: 'Interstellar', year: 2014, tagline: 'Love transcends all' },
        { title: 'Ex Machina', year: 2014, tagline: 'Can machines feel?' }
    ],
    'Documentary': [
        { title: 'Free Solo', year: 2018, tagline: 'Climb without a rope' },
        { title: 'Wont You Be My Neighbor?', year: 2018, tagline: 'Kindness is powerful' },
        { title: 'The Social Dilemma', year: 2020, tagline: 'Are we the product?' },
        { title: '13th', year: 2016, tagline: 'Justice and inequality exposed' }
    ]
};

console.log('✓ Popcorn config loaded');