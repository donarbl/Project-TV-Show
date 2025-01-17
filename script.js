let allShows = [];
let allEpisodes = [];
let showEpisodesCache = {};

function fetchShows() {
  if (allShows.length === 0) {
    const response = await fetch('https://api.tvmaze.com/shows');
    if (!response.ok) throw new Error('Failed to fetch shows');
    allShows = await response.json();
    allShows.sort((a, b) => a.name.localeCompare(b.name));
  }
  return allShows;
}

function generateShowHTML(show) {
  return `
    <article class="show-card" data-id="${show.id}">
      <img src="${show.image?.medium || 'https://via.placeholder.com/250x350'}" alt="${show.name}">
      <div class="show-content">
        <h2>${show.name}</h2>
        <p>${show.genres.join(', ')}</p>
        <p>Status: ${show.status}</p>
        <p>Rating: ${show.rating.average || 'N/A'}</p>
        <p>Runtime: ${show.runtime || 'N/A'} mins</p>
        <p>${show.summary || ''}</p>
      </div>
    </article>`;
}

function renderShows(shows) {
  const showsGrid = document.getElementById('shows-grid');
  showsGrid.innerHTML = shows.map(generateShowHTML).join('');
}

function renderEpisodes(episodes) {
  const episodesGrid = document.getElementById('episodes-grid');
  episodesGrid.innerHTML = episodes.map(generateEpisodeHTML).join('');
  document.getElementById('search-result').textContent = `Showing ${episodes.length} of ${allEpisodes.length} episodes`;
}

function toggleView(view) {
  const showsGrid = document.getElementById('shows-grid');
  const episodesGrid = document.getElementById('episodes-grid');
  const backButton = document.getElementById('back-to-shows');
  const searchShows = document.getElementById('search-shows');
  const searchEpisodes = document.getElementById('search-episodes');
  const episodeSelector = document.getElementById('episode-selector');

  if (view === 'shows') {
    showsGrid.style.display = 'grid';
    episodesGrid.style.display = 'none';
    backButton.style.display = 'none';
    searchShows.style.display = 'block';
    searchEpisodes.style.display = 'none';
    episodeSelector.style.display = 'none';
  } else {
    showsGrid.style.display = 'none';
    episodesGrid.style.display = 'grid';
    backButton.style.display = 'block';
    searchShows.style.display = 'none';
    searchEpisodes.style.display = 'block';
    episodeSelector.style.display = 'block';
  }
}

function handleShowClick(event) {
  const showCard = event.target.closest('.show-card');
  if (!showCard) return;
  const showId = showCard.dataset.id;

  if (!showEpisodesCache[showId]) {
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    if (!response.ok) throw new Error('Failed to fetch episodes');
    showEpisodesCache[showId] = await response.json();
  }

  allEpisodes = showEpisodesCache[showId];
  renderEpisodes(allEpisodes);
  populateEpisodeSelector();
  toggleView('episodes');
}

document.getElementById('back-to-shows').addEventListener('click', () => toggleView('shows'));
document.getElementById('search-shows').addEventListener('input', (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const filteredShows = allShows.filter(show =>
    show.name.toLowerCase().includes(searchTerm) ||
    show.genres.some(genre => genre.toLowerCase().includes(searchTerm)) ||
    (show.summary && show.summary.toLowerCase().includes(searchTerm))
  );
  renderShows(filteredShows);
});

document.addEventListener('DOMContentLoaded', async () => {
  const shows = await fetchShows();
  renderShows(shows);
  document.getElementById('shows-grid').addEventListener('click', handleShowClick);
});
