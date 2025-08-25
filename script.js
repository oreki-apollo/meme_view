const memeContainer = document.getElementById("meme-container");
const loader = document.getElementById("loader");
const errorBox = document.getElementById("error");
const tabs = document.querySelectorAll(".tab");

let currentCategory = "";
let isLoading = false;
let fetchedUrls = new Set();
const batchSize = 8; // number of memes per fetch

function showLoading() {
  if (loader) loader.classList.remove("hidden");
}

function hideLoading() {
  if (loader) loader.classList.add("hidden");
}

async function fetchMemes(category = "") {
  if (isLoading) return;
  isLoading = true;
  showLoading();
  if (errorBox) errorBox.classList.add("hidden");

  try {
    const endpoint = category
      ? `https://meme-api.com/gimme/${category}/${batchSize}`
      : `https://meme-api.com/gimme/${batchSize}`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error("API error: " + res.status);

    const data = await res.json();
    const memes = Array.isArray(data.memes) ? data.memes : [data];

    memes.forEach(meme => {
      if (meme.nsfw || meme.spoiler) return;
      if (fetchedUrls.has(meme.url)) return;
      fetchedUrls.add(meme.url);

      const card = document.createElement("div");
      card.className = "meme-card";
      card.innerHTML = `
        <img src="${meme.url}" alt="meme">
        <div class="meme-title">${meme.title}</div>
      `;
      memeContainer.appendChild(card);
    });

  } catch (err) {
    console.error("Error fetching memes:", err);
    if (errorBox) errorBox.classList.remove("hidden");
  } finally {
    hideLoading();
    isLoading = false;
  }
}

// Infinite scroll
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    fetchMemes(currentCategory);
  }
});

// Tab switching
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentCategory = tab.dataset.category;
    memeContainer.innerHTML = "";
    fetchedUrls.clear();
    fetchMemes(currentCategory);
  });
});

function retry() {
  fetchMemes(currentCategory);
}

// Initial load with a batch
fetchMemes();
