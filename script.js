let allEpisodes = [];

function padNumber(number) {
  return number.toString().padStart(2, '0');
}

function generateEpisodeHTML(episode) {
  const episodeNumber = `S${padNumber(episode.season)}E${padNumber(episode.number)}`;
  const imageUrl = episode.image ? episode.image.medium : 'placeholder-image-url.jpg';
  const summary = episode.summary || 'No summary available';

  return `
    <article class="episode-card">
      <div class="episode-badge">${episodeNumber}</div>
      <img src="${imageUrl}" alt="${episode.name}">
      <div class="episode-content">
        <h2>${episode.name}</h2>
        <p>${summary}</p>
      </div>
    </article>`;
}

function renderEpisodes(episodesToDisplay) {
  const episodesGrid = document.getElementById('episodes-grid');
  episodesGrid.innerHTML = episodesToDisplay.map(generateEpisodeHTML).join('');

  const searchResult = document.getElementById('search-result');
  searchResult.textContent = `Showing ${episodesToDisplay.length}/${allEpisodes.length} episodes`;
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

async function fetchEpisodes() {
  try {
    const response = await fetch('https://api.tvmaze.com/shows/82/episodes');
    if (!response.ok) {
      throw new Error('Failed to fetch episodes');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const episodesGrid = document.getElementById('episodes-grid');
  const searchBox = document.getElementById('search-box');
  const episodeSelector = document.getElementById('episode-selector');

  episodesGrid.innerHTML = '<p>Loading episodes...</p>';

  try {
    allEpisodes = await fetchEpisodes();
    renderEpisodes(allEpisodes);
    populateEpisodeSelector();

    searchBox.addEventListener('input', filterEpisodes);
    episodeSelector.addEventListener('change', handleEpisodeSelection);
  } catch (error) {
    episodesGrid.innerHTML = '<p>Error loading episodes. Please try again later.</p>';
    console.error('Error:', error);
  }
});
