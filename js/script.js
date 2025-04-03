const recipesContainer = document.getElementById("recipes-container");
const searchInput = document.getElementById("search-input");
const clearSearchIcon = document.getElementById("clear-search");
let recipesList = [];
let searchTerm = "";

const applyFilters = () => {
  let filteredRecipes = recipesList;

  if (searchTerm.length > 0) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm) ||
      recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(searchTerm))
    );
  }

  displayRecipes(filteredRecipes);
};

searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.toLowerCase();
  applyFilters();
  clearSearchIcon.classList.toggle("hidden", searchTerm.length === 0);
});

clearSearchIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  applyFilters();
  clearSearchIcon.classList.add("hidden");
});

const displayRecipes = (recipes) => {
  recipesContainer.innerHTML = "";
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.className = "w-full max-w-sm bg-white rounded-[21px] shadow-md overflow-hidden relative";

    const recipeImage = document.createElement("img");
    recipeImage.src = `assets/images/${recipe.image}`;
    recipeImage.alt = recipe.name;
    recipeImage.className = "w-full h-[250px] object-cover rounded-t-lg";

    const recipeTime = document.createElement("div");
    recipeTime.textContent = `${recipe.time} min`;
    recipeTime.className = "absolute top-[22px] right-[22px] bg-[#FFD15B] text-[#1B1B1B] font-[Manrope] font-normal text-[12px] leading-none text-center pt-[5px] pr-[15px] pb-[5px] pl-[15px] rounded-[14px]";

    const recipeContent = document.createElement("div");
    recipeContent.className = "px-[25px] py-[32px]";

    const recipeTitle = document.createElement("h3");
    recipeTitle.textContent = recipe.name;
    recipeTitle.className = "font-[Anton] text-[18px] mb-[29px]";

    const recipeLabel = document.createElement("p");
    recipeLabel.textContent = "Recette";
    recipeLabel.className = "font-[Manrope] uppercase font-bold text-[12px] mt-[29px] mb-[15px]";

    const recipeDescription = document.createElement("p");
    recipeDescription.textContent = recipe.description;
    recipeDescription.className = "font-[Manrope] text-[14px] line-clamp-4 overflow-hidden mt-[15px]";

    const ingredientsLabel = document.createElement("p");
    ingredientsLabel.textContent = "Ingrédients";
    ingredientsLabel.className = "font-[Manrope] uppercase font-bold text-[12px] mt-[32px] mb-[15px]";

    const ingredientsList = document.createElement("ul");
    ingredientsList.className = "grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-[15px]";

    recipe.ingredients.forEach((ingredient) => {
      const li = document.createElement("li");
      li.className = "flex flex-col";

      const name = document.createElement("span");
      name.textContent = ingredient.ingredient;

      const quantity = document.createElement("span");
      quantity.textContent = `${ingredient.quantity || ""} ${ingredient.unit || ""}`;
      quantity.className = "text-gray-600 text-sm";

      li.append(name, quantity);
      ingredientsList.appendChild(li);
    });

    recipeContent.append(recipeTitle, recipeLabel, recipeDescription, ingredientsLabel, ingredientsList);
    recipeCard.append(recipeImage, recipeTime, recipeContent);
    recipesContainer.appendChild(recipeCard);
  });
};

fetch("data/recipes.json")
  .then((response) => response.json())
  .then((recipes) => {
    recipesList = recipes;
    displayRecipes(recipesList);
  })
  .catch((error) => console.error("Erreur lors du chargement des recettes :", error));