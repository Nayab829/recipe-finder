// ==========================================
//               Constants
// ==========================================
const GET_BY_ID = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// ==========================================
//              Show Error Message
// ==========================================
const showError = (message) => {
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = "text-align:center; margin-top:100px; color:red;";
    errorDiv.innerHTML = `<h2>${message}</h2>`;
    document.body.appendChild(errorDiv);
};
// ==========================================
//         Fetch & Render Single Recipe
// ==========================================
const getSingleRecipe = async (id) => {
    if (!id) {
        showError("No recipe ID provided in URL.");
        return;
    }

    try {
        const res = await fetch(GET_BY_ID + id);
        const data = await res.json();

        if (!data.meals || data.meals.length === 0) {
            showError("Recipe not found.");
            return;
        }

        const meal = data.meals[0];
        renderContent(meal);
    } catch (error) {
        console.error("Error while fetching recipe details", error);
        showError("Something went wrong while fetching recipe.");
    }
};

getSingleRecipe(id);

// ==========================================
//             Render Recipe Content
// ==========================================
const renderContent = (meal) => {
    const card = document.createElement("section");
    card.classList.add("recipe-section");

    card.innerHTML = `
        <div>
            <h1>${meal.strMeal}</h1>
            <div>
                <strong>Instructions:</strong>
                <p>${meal.strInstructions}</p>
                <button class="recipe-btn">
                    <a href="${meal.strYoutube}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
                </button>
            </div>
        </div>
        <div>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
    `;

    document.body.appendChild(card);
};


