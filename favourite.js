// getAllFavRecipes
const getAllFavRecipes = async () => {
    const container = document.querySelector(".cards-container");
    const res = await fetch("http://localhost:3000/favourites", {
        method: "GET"
    })
    const data = await res.json();
    container.innerHTML = "";
    if (data.length === 0) {
        container.innerHTML = `<p>No favourite recipes yet.</p>`
    } else {
        data.forEach((meal) => {
            container.appendChild(renderFavCard(meal))
        })
    }

    console.log(data);



}
getAllFavRecipes()
const renderFavCard = (meal) => {
    const card = document.createElement("div");
    card.className = "fav-recipe-card";
    card.innerHTML = `
    <div class="img">
        <img src="${meal.image}" alt="${meal.title}">
    </div>
    <h3 class="name">${meal.title}</h3>
    <div class="btn-box">
        <button class="recipe-btn" data-id="${meal.idMeal}">View Recipe</button>
      <button class="remove-btn btn" data-id="${meal._id}">Remove</button>
    </div>
  `;
    return card;
};

// View recipe handler for favourites page
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("recipe-btn")) {
        const id = e.target.dataset.id;
        getSingleRecipe(id); // This function must be declared in this file too
    }
});


document.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
        const id = e.target.dataset.id;
        removeRecipe(id)
    }
})
const removeRecipe = async (id) => {
    try {
        const res = await fetch(`http://localhost:3000/favourites/${id}`, {
            method: "DELETE"
        })
        const data = await res.json();
        showToast(data);
        getAllFavRecipes();
    } catch (error) {
        console.log("Error while deleting recipe");
        showToast("Error while deleting recipe")

    }
}