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
            summary: "<p>Lord Eddard Stark, ruler of the North, is summoned to court by his old friend...</p>",
        },
        {
            id: 4953,
            url: "http://www.tvmaze.com/episodes/4953/game-of-thrones-1x02-the-kingsroad",
            name: "The Kingsroad",
            season: 1,
            number: 2,
            airdate: "2011-04-24",
            airtime: "21:00",
            airstamp: "2011-04-25T01:00:00+00:00",
            runtime: 60,
            image: {
                medium: "http://static.tvmaze.com/uploads/images/medium_landscape/1/2669.jpg",
            },
            summary: "<p>An incident on the Kingsroad threatens Eddard and Robert's friendship...</p>",
        },
        {
            id: 4954,
            url: "http://www.tvmaze.com/episodes/4954/game-of-thrones-1x03-lord-snow",
            name: "Lord Snow",
            season: 1,
            number: 3,
            airdate: "2011-05-01",
            airtime: "21:00",
            airstamp: "2011-05-02T01:00:00+00:00",
            runtime: 60,
            image: {
                medium: "http://static.tvmaze.com/uploads/images/medium_landscape/1/2670.jpg",
            },
            summary: "<p>Jon Snow attempts to find his place among the Night's Watch...</p>",
        },
        {
            id: 4955,
            url: "http://www.tvmaze.com/episodes/4955/game-of-thrones-1x04-cripples-bastards-and-broken-things",
            name: "Cripples, Bastards, and Broken Things",
            season: 1,
            number: 4,
            airdate: "2011-05-08",
            airtime: "21:00",
            airstamp: "2011-05-09T01:00:00+00:00",
            runtime: 60,
            image: {
                medium: "http://static.tvmaze.com/uploads/images/medium_landscape/1/2671.jpg",
            },
            summary: "<p>Tyrion stops at Winterfell on his way home and gets a chilly reception...</p>",
        },
        {
            id: 4956,
            url: "http://www.tvmaze.com/episodes/4956/game-of-thrones-1x05-the-wolf-and-the-lion",
            name: "The Wolf and the Lion",
            season: 1,
            number: 5,
            airdate: "2011-05-15",
            airtime: "21:00",
            airstamp: "2011-05-16T01:00:00+00:00",
            runtime: 60,
            image: {
                medium: "http://static.tvmaze.com/uploads/images/medium_landscape/1/2672.jpg",
            },
            summary: "<p>Catelyn's actions on the road have repercussions for Eddard...</p>",
        },
        {
            id: 4957,
            url: "http://www.tvmaze.com/episodes/4957/game-of-thrones-1x06-a-golden-crown",
            name: "A Golden Crown",
            season: 1,
            number: 6,
            airdate: "2011-05-22",
            airtime: "21:00",
            airstamp: "2011-05-23T01:00:00+00:00",
            runtime: 60,
            image: {
                medium: "http://static.tvmaze.com/uploads/images/medium_landscape/1/2673.jpg",
            },
            summary: "<p>Viserys is increasingly frustrated by the lack of progress...</p>",
        },
    ];
}

document.addEventListener("DOMContentLoaded", () => {
    const episodes = getAllEpisodes();
    const container = document.getElementById("episode-container");

    episodes.forEach((episode) => {
        const card = document.createElement("div");
        card.className = "episode-card";

        // Generate episode info (S01E01)
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


