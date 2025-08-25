// script.js (debug version)
const memeContainer = document.getElementById("meme-container");
const loader = document.getElementById("loader");
const errorBox = document.getElementById("error");
const tabs = document.querySelectorAll(".tab");

let currentCategory = "";
let isLoading = false;
let fetchedUrls = new Set();

function showLoading() {
  if (loader) loader.classList.remove("hidden");
}

function hideLoading() {
  if (loader) loader.classList.add("hidden");
}

async function fetchMeme(category = "") {
  if (isLoading) return;
  isLoading = true;
  showLoading();
  if (errorBox) errorBox.classList.add("hidden");

  try {
    // Correct endpoint handling
    const endpoint = category 
      ? `https://meme-api.com/gimme/${category}` 
      : "https://meme-api.com/gimme";
    console.log("Fetching memes from:", endpoint);

    const res = await fetch(endpoint);
    console.log("Response status:", res.status);

    if (!res.ok) throw new Error("API error: " + res.status);

    const data = await res.json();
    console.log("Fetched meme data:", data);

    // Skip NSFW or spoilers
    if (data.nsfw || data.spoiler) {
      console.warn("Skipped NSFW/spoiler meme:", data.title);
      isLoading = false;
      hideLoading();
      return fetchMeme(category);
    }

    // Prevent duplicates
    if (fetchedUrls.has(data.url)) {
      console.warn("Duplicate meme skipped:", data.url);
      isLoading = false;
      hideLoading();
      return fetchMeme(category);
    }
    fetchedUrls.add(data.url);

    const card = document.createElement("div");
    card.className = "meme-card";
    card.innerHTML = `
      <img src="${data.url}" alt="meme">
      <div class="meme-title">${data.title}</div>
    `;
    memeContainer.appendChild(card);

  } catch (err) {
    console.error("Error fetching meme:", err);
    if (errorBox) errorBox.classList.remove("hidden");
  } finally {
    hideLoading();
    isLoading = false;
  }
}

// Infinite scroll
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    fetchMeme(currentCategory);
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
    fetchMeme(currentCategory);
  });
});

function retry() {
  fetchMeme(currentCategory);
}

// Initial load
fetchMeme();
