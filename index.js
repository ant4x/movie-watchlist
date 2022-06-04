let moviesIdsArray = [];
let moviesData = [];

const moviesList = document.getElementById('movies-list');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const placeholderBlock = document.getElementById('placeholder-block');

async function fetchMoviesData(title) {
    try {
        const searchResponse = await fetch(`https://www.omdbapi.com/?apikey=c824a04b&s=${title}`);
        const searchData = await searchResponse.json();
        if (searchData.Search) {
            searchData.Search.slice(0, 5).map(movie => {
                moviesIdsArray.push(movie.imdbID);
            });
            return fetchDetailedMoviesData(moviesIdsArray);
        } else if (!searchData.Search) {
            renderNothingFoundMessage();
        }
    } catch (err) {
        console.log('Error:', err);
    }
}

function fetchDetailedMoviesData(ids) {
    try {
        ids.map(async (id) => {
            const idResponse = await fetch(`https://www.omdbapi.com/?apikey=c824a04b&i=${id}`);
            const idData = await idResponse.json();
            if (idData.Poster === "N/A") {
                idData.Poster = `./img/nice-background.jpg`
            };
            const { Title, Runtime, Genre, Poster, imdbRating, Plot, imdbID } = idData;
            moviesData.push({
                Title,
                Runtime,
                Genre,
                Poster,
                imdbRating,
                Plot,
                imdbID
            })
            return displayMoviesDataHtml(moviesData)
        })
    } catch (err) {
        console.log('Error:', err);
    }
}

function displayMoviesDataHtml(movies) {
    let html = '';
    for (let movie of movies) {
        const { Title, Runtime, Genre, Poster, imdbRating, Plot, imdbID } = movie;
        html += `
        <div class="movie-block">
            <img src="${Poster}" alt="movie-cover" class="movie-img">
                <div class="movie-container">
                    <div class="movie-name-line">
                        <h2 class="movie-name">${Title}</h2>
                        <p class="rating"><img src="./img/rating-star-icon.png" alt="rating-star">${imdbRating}</p>
                    </div>
                    <div class="movie-data-line">
                        <div class="movie-length">${Runtime}</div>
                        <div class="movie-genres">${Genre}</div>
                        <div class="add-to-watchlist" id="${imdbID}">
                        ${(localStorage.getItem(`${imdbID}`)) ?
                `<img src="./img/watchlist-minus-icon.png" alt="minus-icon"> Remove` :
                `<img src="./img/watchlist-plus-icon.png" alt="plus-icon" id="plus-icon" />Watchlist`}
                        
                        </div>
                    </div>
                    <p class="movie-description">${Plot}</p>
                </div>
        </div>
        `
    }
    moviesList.innerHTML = html;

    // adding event listeners to the watchlist buttons
    let addToWatchlistButtons = document.querySelectorAll('.add-to-watchlist');
    for (let button of addToWatchlistButtons) {
        button.addEventListener('click', addToWatchlist);
    }
}

searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    placeholderBlock.remove();
    fetchMoviesData(searchInput.value);
    searchInput.value = ''
    moviesIdsArray = [];
    moviesData = [];
})

async function saveToLocalStorage(id) {
    const idResponse = await fetch(`https://www.omdbapi.com/?apikey=c824a04b&i=${id}`);
    const idData = await idResponse.json();
    const { Title, Runtime, Genre, Poster, imdbRating, Plot, imdbID } = idData;
    localStorage.setItem(`${imdbID}`, JSON.stringify(
        {
            Title,
            Runtime,
            Genre,
            Poster,
            imdbRating,
            Plot,
            imdbID
        }
    ));
}

function addToWatchlist(event) {
    const addIcon = `img/watchlist-plus-icon.png`;
    const removeIcon = `img/watchlist-minus-icon.png`;
    const baseUrl = `https://ant4x.github.io/movie-watchlist/`;

    if (event.target.children[0].src === baseUrl + addIcon) {
        event.target.children[0].src = baseUrl + removeIcon
        saveToLocalStorage(event.target.id);


    } else {
        event.target.children[0].src = baseUrl + addIcon;
        localStorage.removeItem(event.target.id)
    }
}

function renderNothingFoundMessage() {
    moviesList.innerHTML = `
    <div id="placeholder-block" class="placeholder-block">
    <p>Unable to find what you’re looking for.
    Please try another search.</p>
</div>
    `;
}