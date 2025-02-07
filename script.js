const inputForm = document.querySelector(".inputForm");
const githubUsername = document.querySelector(".githubUsername");
const card = document.querySelector(".card");

document.addEventListener("keydown", event => {
    if(event.key === "/") {
        event.preventDefault();
        githubUsername.focus();
    }
});

githubUsername.addEventListener("keydown", event => {
    if(event.key === "Escape") {
        event.target.blur();
    }
});

inputForm.addEventListener("submit", async event => {
    event.preventDefault();
    const username = githubUsername.value.trim();

    if(username) {
        try {
            const profileData = await getProfileInfo(username);
            displayProfileInfo(profileData);
        }
        catch(error) {
            console.error(error);
            displayError(error);
        }
    }
    else {
        
    }
});

async function getProfileInfo(username) {
    const apiUrl = `https://api.github.com/users/${username}`;

    const response = await fetch(apiUrl);
    
    if(!response.ok) {
        throw new Error("Could not fetch data.");
    }
    else {
        return await response.json();
    }
}

function displayProfileInfo(data) {
    card.innerHTML = "";
    card.style.display = "flex";

    const pfp = document.createElement("img");
    pfp.style.width = "150px";
    pfp.src = data.avatar_url;
    pfp.alt = `${data.login}'s avatar`;
    pfp.classList.add("pfp");

    const name = document.createElement("p");
    name.textContent = data.name || "No name provided";
    name.classList.add("name");

    const username = document.createElement("p");
    username.innerHTML = `<a href="https://github.com/${data.login}" target="_blank">@${data.login}</a>`;
    username.classList.add("username");

    const bio = document.createElement("p");
    bio.textContent = data.bio || "No bio available.";
    bio.classList.add("bio");

    const container = document.createElement("div");

    function createStat(label, value, className) {
        const stat = document.createElement("p");
        stat.classList.add(className);
        stat.innerHTML = `<span>${label} </span>${value}`;
        return stat;
    }

    const followers = createStat("Followers", data.followers, "followers");
    const following = createStat("Following", data.following, "following");
    const repositories = createStat("Repositories", data.public_repos, "repositories");

    container.appendChild(followers);
    container.appendChild(following);
    container.appendChild(repositories);

    card.appendChild(pfp);
    card.appendChild(name);
    card.appendChild(username);
    card.appendChild(bio);
    card.appendChild(container);
}

function displayError(message) {
    const errorText = document.createElement("p");
    errorText.classList.add("errorText");
    errorText.textContent = message;

    card.style.display = "flex";
    card.textContent = "";
    card.appendChild(errorText);
}