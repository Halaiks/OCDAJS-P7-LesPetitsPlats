let selectedIngredients = [];
let selectedAppliances = [];
let selectedUstensils = [];

let availableIngredients = [];
let availableAppliances = [];
let availableUstensils = [];

const filterContainer = document.createElement("div");
filterContainer.className = "flex gap-[66px]";
document.querySelector("main").prepend(filterContainer);

const recipesContainer = document.getElementById("recipes-container");
const searchInput = document.getElementById("search-input");
const clearSearchIcon = document.getElementById("clear-search");
let recipesList = [];
let searchTerm = "";

const applyFilters = () => {
  let filteredRecipes = recipesList;

  if (selectedIngredients.length > 0) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      selectedIngredients.every(selectedIngredient =>
        recipe.ingredients.some(ing => ing.ingredient === selectedIngredient)
      )
    );
  }

  if (selectedAppliances.length > 0) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      selectedAppliances.includes(recipe.appliance)
    );
  }

  if (selectedUstensils.length > 0) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      selectedUstensils.every(selectedUstensil =>
        recipe.ustensils.includes(selectedUstensil)
      )
    );
  }

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
    updateFilterOptions(recipesList);
    generateFilterSelect("Ingrédients", "ingredient", selectedIngredients);
    generateFilterSelect("Appareils", "appliance", selectedAppliances);
    generateFilterSelect("Ustensiles", "ustensil", selectedUstensils);
  })
  .catch((error) => console.error("Erreur lors du chargement des recettes :", error));

const updateFilterOptions = (recipes) => {
  availableIngredients = [...new Set(recipes.flatMap(r => r.ingredients.map(i => i.ingredient)))];
  availableAppliances = [...new Set(recipes.map(r => r.appliance))];
  availableUstensils = [...new Set(recipes.flatMap(r => r.ustensils))];
};

const generateFilterSelect = (label, type, selectedArray) => {
  let itemsList = [];
  if (type === "ingredient") itemsList = availableIngredients;
  if (type === "appliance") itemsList = availableAppliances;
  if (type === "ustensil") itemsList = availableUstensils;

  const filterSelect = document.createElement("div");
  filterSelect.className = "relative bg-white rounded-[11px] p-4 w-[195px]";

  const filterSelectHeader = document.createElement("div");
  filterSelectHeader.className = "flex justify-between items-center cursor-pointer";
  filterSelectHeader.textContent = label;

  const arrowIcon = document.createElement("img");
  arrowIcon.src = "assets/utils/icons/arrow-down.svg";
  arrowIcon.className = "w-4 h-4 transition-transform duration-200 ease-in-out";
  filterSelectHeader.appendChild(arrowIcon);

  const itemListContainer = document.createElement("div");
  itemListContainer.className = "hidden absolute left-0 w-full bg-white shadow-lg rounded-lg p-4 z-50";
  itemListContainer.dataset.type = type;

  const itemSearch = document.createElement("input");
  itemSearch.className = "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400";
  itemSearch.placeholder = `Rechercher un ${label.toLowerCase()}...`;

  const itemScrollContainer = document.createElement("div");
  itemScrollContainer.className = "max-h-[315px] overflow-y-auto mt-2 scrollbar-hide";

  itemsList.forEach(item => {
    const itemOption = document.createElement("div");
    itemOption.className = `item-option-${type} cursor-pointer py-1 px-2 hover:bg-[#FFD15B]`;
    itemOption.textContent = item;
    itemOption.addEventListener("click", () => toggleFilter(item, itemOption, selectedArray));
    itemScrollContainer.appendChild(itemOption);
  });

  itemSearch.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    document.querySelectorAll(`.item-option-${type}`).forEach(option => {
      option.classList.toggle("hidden", !option.textContent.toLowerCase().includes(value));
    });
  });

  filterSelectHeader.addEventListener("click", () => {
    itemListContainer.classList.toggle("hidden");
    arrowIcon.style.transform = itemListContainer.classList.contains("hidden") ? "rotate(0deg)" : "rotate(180deg)";
  });

  itemListContainer.append(itemSearch, itemScrollContainer);
  filterSelect.append(filterSelectHeader, itemListContainer);
  filterContainer.appendChild(filterSelect);
};

const toggleFilter = (item, element, selectedArray) => {
  const index = selectedArray.indexOf(item);
  if (index !== -1) {
    selectedArray.splice(index, 1);
    element.classList.remove("bg-gray-200");
  } else {
    selectedArray.push(item);
    element.classList.add("bg-gray-200");
  }
  applyFilters();
};