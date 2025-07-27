// ==========================================
//         Fetch and Render Favourites
// ==========================================
const container = document.querySelector(".cards-container");

const getAllFavRecipes = async () => {
    try {
        const res = await fetch("http://localhost:3000/favourites");
        const data = await res.json();

        container.innerHTML = data.length
            ? ""
            : `<p>No favourite recipes yet.</p>`;

        data.forEach((meal) => {
            container.appendChild(renderFavCard(meal));
        });
    } catch (error) {
        console.error("Failed to fetch favourites:", error);
        container.innerHTML = `<p>Error loading favourite recipes.</p>`;
    }
};

const renderFavCard = (meal) => {
    const card = document.createElement("div");
    card.className = "fav-recipe-card";
    card.innerHTML = `
        <a href="/recipe.html?id=${meal.idMeal}">
            <div class="img">
                <img src="${meal.image}" alt="${meal.title}">
            </div>
            <h3 class="name">${meal.title}</h3>
        </a>
        <div class="btn-box">
            <button class="recipe-btn" data-id="${meal.idMeal}">View Recipe</button>
            <button class="remove-btn btn" data-id="${meal._id}">Remove</button>
        </div>
    `;
    return card;
};

// ==========================================
//         Event Delegation for Buttons
// ==========================================
document.addEventListener("click", (e) => {
    const target = e.target;

    if (target.classList.contains("recipe-btn")) {
        const id = target.dataset.id;
        getSingleRecipe(id); // Ensure this function is defined
    }

    if (target.classList.contains("remove-btn")) {
        const id = target.dataset.id;
        removeRecipe(id);
    }
});

// ==========================================
//         Remove from Favourites
// ==========================================
const removeRecipe = async (id) => {
    try {
        const res = await fetch(`http://localhost:3000/favourites/${id}`, {
            method: "DELETE"
        });
        const data = await res.json();
        showToast(data); // Ensure showToast is defined
        getAllFavRecipes();
    } catch (error) {
        console.error("Error while deleting recipe:", error);
        showToast("Error while deleting recipe");
    }
};

// ==========================================
//         Initialize
// ==========================================
getAllFavRecipes();
