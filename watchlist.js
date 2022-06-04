const placeholderBlockHtml = ` <div class="placeholder-block">
                        <p>Your watchlist is looking a little empty...</p>
                        <a class="link-to-index" href="index.html">
                        <img src="./img/watchlist-plus-icon.png" alt="plus-icon" />
                        Let's add some movies!</a>
                        </div>`

const watchlist = document.getElementById('watchlist');

function displayWatchlistData() {
    if (localStorage.length > 0) {
        watchlistArray = [];
        for (let i = 0; i < localStorage.length; i++) {
            watchlistArray.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
        }
        displayMoviesDataHtml(watchlistArray);
    } else {
        watchlist.innerHTML = placeholderBlockHtml;
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
                        <div class="add-to-watchlist" onclick="removeFromLocalStorage('${imdbID}')">
                            <img src="./img/watchlist-minus-icon.png" alt="minus-icon"> Remove
                        </div>
                    </div>
                    <p class="movie-description">${Plot}</p>
                </div>
        </div>
        `
    }
    watchlist.innerHTML = html
}

function removeFromLocalStorage(id) {
    localStorage.removeItem(id);
    displayWatchlistData();
}

displayWatchlistData();