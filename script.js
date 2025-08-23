const memeContainer = document.getElementById("meme-container");
const loadingSpinner = document.getElementById("loading-spinner");
const errorMessage = document.getElementById("error-message");

let after = null;
let currentCategory = "all";
let seenUrls = new Set();

async function fetchMemes(category = "all") {
  try {
    showLoading();
    let url;

    if (category === "anime") {
      // Anime specific subreddits
      const animeSubs = ["animememes", "goodanimemes", "AnimeFunny"];
      const randomSub = animeSubs[Math.floor(Math.random() * animeSubs.length)];
      url = `https://www.reddit.com/r/${randomSub}/hot.json?limit=10&after=${after || ""}`;
    } else {
      // Generic meme subreddits
      const allSubs = ["memes", "dankmemes", "wholesomememes"];
      const randomSub = allSubs[Math.floor(Math.random() * allSubs.length)];
      url = `https://www.reddit.com/r/${randomSub}/hot.json?limit=10&after=${after || ""}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network error");

    const data = await response.json();
    after = data.data.after;

    data.data.children.forEach(post => {
      const meme = post.data;
      if (meme.post_hint === "image" && !seenUrls.has(meme.url)) {
        seenUrls.add(meme.url);
        const card = document.createElement("div");
        card.className = "meme-card";
        card.innerHTML = `
          <h3>${meme.title}</h3>
          <img src="${meme.url}" alt="meme" onerror="this.onerror=null;this.parentElement.innerHTML='<p>Failed to load meme.</p>'">
        `;
        memeContainer.appendChild(card);
      }
    });

    hideLoading();
  } catch (err) {
    hideLoading();
    errorMessage.classList.remove("hidden");
  }
}

function showLoading() {
  loadingSpinner.classList.remove("hidden");
  errorMessage.classList.add("hidden");
}

function hideLoading() {
  loadingSpinner.classList.add("hidden");
}

function loadMemes(category) {
  memeContainer.innerHTML = "";
  after = null;
  seenUrls.clear();
  currentCategory = category;
  fetchMemes(category);
}

// Infinite scroll
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
    fetchMemes(currentCategory);
  }
});

// Load default
loadMemes("all");
