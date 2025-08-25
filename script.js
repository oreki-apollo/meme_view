// script.js
const memeContainer = document.getElementById("meme-container");
const loader = document.getElementById("loader");
const errorBox = document.getElementById("error");
const tabs = document.querySelectorAll(".tab");

let currentCategory = "";
let isLoading = false;
let fetchedUrls = new Set();

async function fetchMeme(category = "") {
  if (isLoading) return;
  isLoading = true;
  loader.classList.remove("hidden");
  errorBox.classList.add("hidden");

  try {
    const endpoint = category ? `https://meme-api.com/gimme/${category}` : "https://meme-api.com/gimme";
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();

    // Prevent duplicates
    if (fetchedUrls.has(data.url)) {
      isLoading = false;
      loader.classList.add("hidden");
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
    errorBox.classList.remove("hidden");
  } finally {
    loader.classList.add("hidden");
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
