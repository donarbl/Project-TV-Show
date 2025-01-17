let allShows = [];
let allEpisodes = [];
let showEpisodesCache = {};

function padNumber(number) {
  return number.toString().padStart(2, '0');
}

function generateShowHTML(show) {
  return `
    <article class="show-card" data-show-id="${show.id}">
      <img src="${show.image?.medium || 'https://via.placeholder.com/210x295'}" alt="${show.name}">
      <div class="show-content">
        <h2>${show.name}</h2>
        <p><strong>Genres:</strong> ${show.genres.join(', ')}</p>
        <p><strong>Status:</strong> ${show.status}</p>
        <p><strong>Rating:</strong> ${show.rating.average || 'N/A'}</p>
        <p><strong>Runtime:</strong> ${show.runtime} minutes</p>
        <p>${show.summary || 'No description available.'}</p>
      </div>
    </article>`;
}

function generateEpisodeHTML(episode) {
  const episodeNumber = `S${padNumber(episode.season)}E${padNumber(episode.number)}`;
  return `
    <article class="episode-card" data-episode-id="${episode.id}">
      <div class="episode-badge">${episodeNumber}</div>
      <img src="${episode.image?.medium || 'https://via.placeholder.com/210x295'}" alt="${episode.name}">
      <div class="episode-content">
        <h2>${episode.name}</h2>
        <p>${episode.summary || 'No description available.'}</p>
        <a href="https://www.tvmaze.com/episodes/${episode.id}" target="_blank">View on TV Maze</a>
      </div>
    </article>`;
}

function renderShows(showsToDisplay) {
  const showsGrid = document.getElementById('shows-grid');
  showsGrid.innerHTML = showsToDisplay.map(generateShowHTML).join('');
  showsGrid.style.display = 'grid';
  document.getElementById('episodes-grid').style.display = 'none';
  document.getElementById('episode-controls').style.display = 'none';
}

function renderEpisodes(episodesToDisplay) {
  const episodesGrid = document.getElementById('episodes-grid');
  episodesGrid.innerHTML = episodesToDisplay.map(generateEpisodeHTML).join('');
  episodesGrid.style.display = 'grid';
  document.getElementById('shows-grid').style.display = 'none';
  document.getElementById('episode-controls').style.display = 'block';
  const searchResult = document.getElementById('search-result');
  searchResult.textContent = `Showing ${episodesToDisplay.length} out of ${allEpisodes.length} episodes`;
}

function filterShows(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredShows = allShows.filter(show =>
    show.name.toLowerCase().includes(searchTerm) ||
    show.genres.some(genre => genre.toLowerCase().includes(searchTerm)) ||
    (show.summary && show.summary.toLowerCase().includes(searchTerm))
  );
  renderShows(filteredShows);
}

function filterEpisodes(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredEpisodes = allEpisodes.filter(episode =>
    episode.name.toLowerCase().includes(searchTerm) ||
    (episode.summary && episode.summary.toLowerCase().includes(searchTerm))
  );
  renderEpisodes(filteredEpisodes);
}

function populateEpisodeSelector() {
  const episodeSelector = document.getElementById('episode-selector');
  episodeSelector.innerHTML = '<option value="">Select an Episode</option>';
  allEpisodes.forEach(episode => {
    const episodeNumber = `S${padNumber(episode.season)}E${padNumber(episode.number)}`;
    const option = document.createElement('option');
    option.value = episode.id;
    option.textContent = `${episodeNumber} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });
}

function handleEpisodeSelection(event) {
  const selectedEpisodeId = event.target.value;
  if (selectedEpisodeId) {
    const selectedEpisode = allEpisodes.find(episode => episode.id === Number(selectedEpisodeId));
    renderEpisodes([selectedEpisode]);
  } else {
    renderEpisodes(allEpisodes);
  }
}

async function fetchShows() {
  if (allShows.length === 0) {
    const response = await fetch('https://api.tvmaze.com/shows');
    if (!response.ok) {
      throw new Error('Failed to fetch shows');
    }
    allShows = await response.json();
    allShows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }
  return allShows;
}

async function fetchEpisodes(showId) {
  if (!showEpisodesCache[showId]) {
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    if (!response.ok) {
      throw new Error('Failed to fetch episodes');
    }
    showEpisodesCache[showId] = await response.json();
  }
  return showEpisodesCache[showId];
}

function populateShowSelector(shows) {
  const showSelector = document.getElementById('show-selector');
  showSelector.innerHTML = '<option value="">Select a Show</option>';
  shows.forEach(show => {
    const option = document.createElement('option');
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });
}

async function handleShowSelection(showId) {
  if (showId) {
    try {
      allEpisodes = await fetchEpisodes(showId);
      renderEpisodes(allEpisodes);
      populateEpisodeSelector();
    } catch (error) {
      const episodesGrid = document.getElementById('episodes-grid');
      episodesGrid.innerHTML = `<p class="error">Error loading episodes: ${error.message}</p>`;
    }
  } else {
    renderShows(allShows);
  }
}

function handleBackToShows() {
  renderShows(allShows);
}

function handleEpisodeClick(event) {
  const episodeLink = event.target.closest('a[href^="https://www.tvmaze.com/episodes/"]');
  if (episodeLink) {
    event.preventDefault();
    window.open(episodeLink.href, '_blank');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    allShows = await fetchShows();
    renderShows(allShows);
    populateShowSelector(allShows);
    
    const showSelector = document.getElementById('show-selector');
    showSelector.addEventListener('change', (event) => handleShowSelection(event.target.value));
    
    const showSearch = document.getElementById('show-search');
    showSearch.addEventListener('input', filterShows);
    
    const episodeSearch = document.getElementById('episode-search');
    episodeSearch.addEventListener('input', filterEpisodes);
    
    const episodeSelector = document.getElementById('episode-selector');
    episodeSelector.addEventListener('change', handleEpisodeSelection);
    
    const showsGrid = document.getElementById('shows-grid');
    showsGrid.addEventListener('click', (event) => {
      const showCard = event.target.closest('.show-card');
      if (showCard) {
        handleShowSelection(showCard.dataset.showId);
      }
    });
    
    const episodesGrid = document.getElementById('episodes-grid');
    episodesGrid.addEventListener('click', handleEpisodeClick);
    
    const backToShowsButton = document.getElementById('back-to-shows');
    backToShowsButton.addEventListener('click', handleBackToShows);
  } catch (error) {
    const showsGrid = document.getElementById('shows-grid');
    showsGrid.innerHTML = `<p class="error">Error loading shows: ${error.message}</p>`;
  }
});
