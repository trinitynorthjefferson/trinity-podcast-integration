document.addEventListener("DOMContentLoaded", function() {
  fetch('https://feeds.transistor.fm/trinity-fellowship-of-alabama')
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      const items = data.querySelectorAll("item");
      const episodeContainer = document.getElementById("episodes");

      // Check if the container exists
      if (!episodeContainer) {
        console.error("No container with ID 'episodes' found");
        return;
      }

      // Loop through the first five episodes
      for (let i = 0; i < Math.min(items.length, 5); i++) {
        const item = items[i];
        const title = item.querySelector("title").textContent;
        const description = item.querySelector("description").textContent;
        const audioUrl = item.querySelector("enclosure").getAttribute("url");
        const speaker = item.querySelector("itunes\\:author") ? item.querySelector("itunes\\:author").textContent : 'Unknown Speaker'; 
        const scripture = getScriptureFromDescription(description);

        // Create a new div for each episode
        const episodeDiv = document.createElement("div");
        episodeDiv.classList.add("episode");

        // Insert content into the episode div
        episodeDiv.innerHTML = `
          <h2>${title}</h2>
          <p><strong>Speaker:</strong> ${speaker}</p>
          <p><strong>Scripture Passage:</strong> ${scripture}</p>
          <p>${description}</p>
          <audio controls>
            <source src="${audioUrl}" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
        `;

        episodeContainer.appendChild(episodeDiv);
      }
    })
    .catch(err => console.log('Failed to fetch podcast feed:', err));

  // Function to extract scripture passage from the episode description
  function getScriptureFromDescription(description) {
    const scriptureRegex = /Scripture Passage:\s*(.+?)(?:\.|$)/i;
    const match = description.match(scriptureRegex);
    return match ? match[1] : 'No scripture provided';
  }
});
