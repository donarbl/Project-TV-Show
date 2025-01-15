let allEpisodes = []; // Store all episodes globally for reuse throughout the script

// Utility function to pad numbers with leading zeros (e.g., 1 becomes 01)
function padNumber(number) {
  return number.toString().padStart(2, '0');
}

// Generate HTML structure for an individual episode card
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


// Render the list of episodes on the page
function renderEpisodes(episodesToDisplay) {
  // Select the container for the episodes grid
  const episodesGrid = document.getElementById('episodes-grid');

  // Generate HTML for all episodes to be displayed and update the grid
  episodesGrid.innerHTML = episodesToDisplay.map(generateEpisodeHTML).join('');

  // Update the search result count (e.g., "Showing 3 out of 73 episodes")
  const searchResult = document.getElementById('search-result');
  searchResult.textContent = `Showing ${episodesToDisplay.length}/${allEpisodes.length} episodes`;
}

// Filter episodes based on the search input
function filterEpisodes(event) {
  // Get the search term from the input and convert it to lowercase
  const searchTerm = event.target.value.toLowerCase();

  // Filter episodes where the name or summary includes the search term
  const filteredEpisodes = allEpisodes.filter(episode =>
    episode.name.toLowerCase().includes(searchTerm) ||
    episode.summary.toLowerCase().includes(searchTerm)
  );

  // Render only the filtered episodes
  renderEpisodes(filteredEpisodes);
}

// Populate the episode selector dropdown with all episodes
function populateEpisodeSelector() {
  // Select the dropdown element
  const episodeSelector = document.getElementById('episode-selector');

  // Clear the existing options and add a default "Select an Episode" option
  episodeSelector.innerHTML = '<option value="">Select an Episode</option>';

  // Add an option for each episode with formatted text and value
  allEpisodes.forEach(episode => {
    const episodeNumber = `S${padNumber(episode.season)}E${padNumber(episode.number)}`;
    const option = document.createElement('option');
    option.value = episode.id; // Use the episode ID as the value
    option.textContent = `${episodeNumber} - ${episode.name}`; // Display formatted episode details
    episodeSelector.appendChild(option);
  });
}

// Handle the selection of an episode from the dropdown
function handleEpisodeSelection(event) {
  // Get the selected episode ID from the dropdown
  const selectedEpisodeId = event.target.value;

  if (selectedEpisodeId) {
    // Find the selected episode by ID and render only that episode
    const selectedEpisode = allEpisodes.find(episode => episode.id === Number(selectedEpisodeId));
    renderEpisodes([selectedEpisode]);
  } else {
    // If no specific episode is selected, render all episodes
    renderEpisodes(allEpisodes);
  }
}

// Set up the page once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  const episodesGrid = document.getElementById('episodes-grid');
  const searchBox = document.getElementById('search-box');
  const episodeSelector = document.getElementById('episode-selector');

  // Show loading message
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


  // Add an event listener for live search input
  const searchBox = document.getElementById('search-box');
  searchBox.addEventListener('input', filterEpisodes);

  // Add an event listener for episode selection from the dropdown
  const episodeSelector = document.getElementById('episode-selector');
  episodeSelector.addEventListener('change', handleEpisodeSelection);
});

async function fetch episodes(){
  const loadingMessage = document.getElementById('loading message');
  loadingMessage.textContent = 'loading episodes...'
  try {
    const response = await fetch (''https://api.tvmaze.com/shows/82/episodes'');
      if (!response.ok){
        throw new Error ('Failed to fetch episodes.');
      }
      return await response.json();
  } catch (error){
    throw error;
  }
}