let currentCategory = "all"; // default

function getApiUrl(count) {
    if (currentCategory === "anime") {
        return `https://meme-api.com/gimme/animememes/${count}`;
    }
    return `https://meme-api.com/gimme/${count}`;
}

function loadMore(count) {
    fetch(getApiUrl(count))
    .then(res => {
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        return res.json();
    })
    .then(data => {
        let memes = data.memes || [data];
        let container = document.getElementById("meme-container");

        memes.forEach(meme => {
            let div = document.createElement("div");
            div.classList.add("meme");

            let img = document.createElement("img");
            img.src = meme.url;
            img.alt = "meme";
            img.onerror = () => {
                div.innerHTML = `<p class="error">Failed to load meme image.</p>`;
            };

            div.appendChild(img);
            container.appendChild(div);
        });
    })
    .catch(err => {
        let container = document.getElementById("meme-container");
        let errorMsg = document.createElement("p");
        errorMsg.classList.add("error");
        errorMsg.innerText = "Failed to fetch memes. Please try again.";
        container.appendChild(errorMsg);
        console.error(err);
    });
}

function switchCategory(category) {
    currentCategory = category;

    // reset active tab highlight
    document.querySelectorAll(".tabs button").forEach(btn => btn.classList.remove("active"));
    if (category === "all") {
        document.getElementById("tab-all").classList.add("active");
    } else if (category === "anime") {
        document.getElementById("tab-anime").classList.add("active");
    }

    // clear memes and load fresh
    let container = document.getElementById("meme-container");
    container.innerHTML = "";
    loadMore(5);
}

// load first memes on page open
loadMore(5);
