// ==========================================
//               API Constants
// ==========================================
const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const RANDOM_URL = "https://www.themealdb.com/api/json/v1/1/random.php";
const GET_BY_ID = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

// ==========================================
//               DOM Selectors
// ==========================================
const form = document.querySelector("form");
const input = document.querySelector("form input");
const resultSection = document.querySelector(".recipe-section");
const resultBox = document.querySelector(".recipe-container");
const modal = document.querySelector(".modal");
const spinnerContainer = document.querySelector(".spinner-container");
const featuredContent = document.querySelector(".feature-section");

// ==========================================
//             Utility Functions
// ==========================================

// Show loading spinner
const showSpinner = () => spinnerContainer.classList.remove("hidden");

// Hide loading spinner
const hideSpinner = () => spinnerContainer.classList.add("hidden");

// Render a recipe card
const renderCard = (meal) => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
        <div class="img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <h3 class="name">${meal.strMeal}</h3>
        <button class="recipe-btn" data-id="${meal.idMeal}">View recipe</button>
    `;
    return card;
};

// ==========================================
//            Fetch & Display Recipes
// ==========================================

// Search recipes by query
const searchRecipes = async (query) => {
    try {
        showSpinner();
        resultBox.innerHTML = "";

        const response = await fetch(`${API_URL}${query}`);
        const data = await response.json();

        if (data.meals) {
            data.meals.forEach(meal => {
                resultBox.appendChild(renderCard(meal));
            });
            input.value = "";
            hideSpinner();
        } else {
            resultSection.innerHTML = `<h2 class="error">No recipes found for "${query}"</h2>`;
            hideSpinner();
        }
    } catch (error) {
        console.error("Error loading recipes", error);
        hideSpinner();
        resultSection.innerHTML = `<h2 class="error">Could not load recipes. Please try again later.</h2>`;
    }
};

// Fetch a single recipe by ID and show in modal
const getSingleRecipe = async (id) => {
    try {
        showSpinner();
        modal.innerHTML = "";

        const res = await fetch(GET_BY_ID + id);
        const data = await res.json();
        const meal = data.meals[0];

        const card = document.createElement("div");
        card.classList.add("modal-content");
        card.innerHTML = `
            <button class="close-btn">+</button>
            <h1>${meal.strMeal}</h1>
            <span>Instructions:</span>
            <p>${meal.strInstructions}</p>
            <button class="recipe-btn">
                <a href="${meal.strYoutube}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
            </button>
        `;

        modal.appendChild(card);
        modal.classList.remove("hidden");
        hideSpinner();

        // Close modal on button click
        document.querySelector(".close-btn").addEventListener("click", () => {
            modal.classList.add("hidden");
        });
    } catch (error) {
        console.error("Error while fetching recipe details", error);
        hideSpinner();
    }
};

// Load a random featured recipe on page load
const loadFeaturedRecipe = async () => {
    try {
        showSpinner();

        const res = await fetch(RANDOM_URL);
        if (!res.ok) throw new Error("Error while fetching API");

        const data = await res.json();
        const meal = data.meals[0];

        featuredContent.innerHTML = `
            <h1 class="feature-heading">Featured <span class="coral">Recipe</span></h1>
            <section class="feature-container">
                <div class="feature-text">
                    <h2>${meal.strMeal}</h2>
                    <p>${meal.strInstructions.slice(0, 200)}...</p>
                    <div class="btn-box">
                        <button class="recipe-btn" data-id="${meal.idMeal}">View Recipe</button>
                        <button>
                            <a href="${meal.strYoutube}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
                        </button>
                    </div>
                </div>
                <div class="feature-img">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                </div>
            </section>
        `;

        hideSpinner();

        // Handle "View Recipe" button click
        document.querySelector(".recipe-btn").addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            getSingleRecipe(id);
        });
    } catch (error) {
        console.error("Error loading featured recipe:", error);
        hideSpinner();
        featuredContent.innerHTML = `<h2 class="error">Could not load featured recipe. Please try again later.</h2>`;
    }
};

// ==========================================
//             Event Listeners
// ==========================================

// Handle form submission (search)
form.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) {
        resultSection.innerHTML = `<h2>Please enter a value</h2>`;
        return;
    }
    searchRecipes(query);
});

// Handle clicks on recipe cards
resultBox.addEventListener("click", (e) => {
    if (e.target.classList.contains("recipe-btn")) {
        const id = e.target.dataset.id;
        getSingleRecipe(id);
    }
});

// ==========================================
//             Initial Function Call
// ==========================================
loadFeaturedRecipe();
