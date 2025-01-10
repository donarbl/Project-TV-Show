//You can edit ALL of the code here
function getAllEpisodes() {
    return [
        {
            id: 4952,
            url: "http://www.tvmaze.com/episodes/4952/game-of-thrones-1x01-winter-is-coming",
            name: "Winter is Coming",
            season: 1,
            number: 1,
            airdate: "2011-04-17",
            airtime: "21:00",
            airstamp: "2011-04-18T01:00:00+00:00",
            runtime: 60,
            image: {
                medium: "http://static.tvmaze.com/uploads/images/medium_landscape/1/2668.jpg",
            },
            summary: "<p>Lord Eddard Stark, ruler of the North, is summoned...</p>",
        },
        // Add more episode objects for testing
    ];
}
document.addEventListener("DOMContentLoaded", () => {
    const episodes = getAllEpisodes();
    const container = document.getElementById("episode-container");

    episodes.forEach((episode) => {
        const card = document.createElement("div");
        card.className = "episode-card";

        // Generate episode code (e.g., S01E01)
        const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
            episode.number
        ).padStart(2, "0")}`;

        card.innerHTML = `
            <img src="${episode.image.medium}" alt="Image of ${episode.name}">
            <h2>${episode.name}</h2>
            <span class="episode-code">${episodeCode}</span>
            <p>${episode.summary || "No summary available."}</p>
            <a href="${episode.url}" target="_blank">More Info</a>
        `;

        container.appendChild(card);
    });
});


