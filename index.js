var apiKey = "3bf05a08e3c2bc3af3580f3822028b9b";
var imgApi = "https://image.tmdb.org/t/p/w1280";
var searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;

var form = document.getElementById("search-form");
var query = document.getElementById("search-input");
var result  = document.getElementById("result");

let page = 1;
let isSearching = false;

async function fetchData(url) {
    try {
        var response = await fetch(url);
        if(!response.ok) {
            throw new Error("Not ok");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

async function fetchAndShow(url){
    var data = await fetchData(url);
    if(data && data.results) {
        showResults(data.results);
    }
}

function movieCard(movie) {
    var { poster_path, original_title, release_date, overview } = movie;
    var imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";
    var truncatedTitle = original_title.length > 15 ? original_title.slice(0, 15) + "..." : original_title;
    var formattedDate = release_date || "No release date";
    var cardTemplate = `
    <div class="column">
        <div class="card">
            <a class="card-media" href="${imagePath}">
                <img src="${imagePath}" alt="${original_title}" width="100%" />
            </a>
            <div class="card-content">
                <div class="card-header">
                    <div class="left-content">
                    <h3 style="font-weight: 600">${truncatedTitle}</h3>
                    <span style="color: #§12efec">${formattedDate}</span>
                    </div>
                <div class="right-content">
                    <a href="${imagePath}" target="_blank" class="card-btn">See Cover</a>
                </div>
            </div>
            <div class="info">
            ${overview || "No overview..."}
            </div>
        </div>
    </div>
</div>
`;
return cardTemplate;
}    

function clearResults() {
    result.innerHTML = "";
}

function showResults(item) {
    var newContent = item.map(movieCard).join("");
    result.innerHTML += newContent || "<p> Not found.</p>";
}

async function loadMoreResults() {
    if(isSearching) {
        return;
    }
    page++;
    var searchTerm = query.value;
    var url = searchTerm ? `${searchUrl}${searchTerm}&page=${page}` : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    await fetchAndShow(url); 
}

function detectEnd() {
    var { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if( scrollTop + clientHeight >= scrollHeight - 20) {
        loadMoreResults();
    }
}
async function handleSearch(e) {
    e.preventDefault();
    var searchTerm = query.value.trim();
    if(searchTerm) {
        isSearching = true;
        clearResults();
        var newUrl = `${searchUrl}${searchTerm}&page=${page}`;
        await fetchAndShow(newUrl);
        query.value = "";
    }
}

form.addEventListener('submit', handleSearch);
window.addEventListener('scroll', detectEnd);
window.addEventListener('resize', detectEnd);

async function init() {
    clearResults();
    var url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    isSearching = false;
    await fetchAndShow(url);
}
init();
