const createElement = (tag, className = "", textContent = "") => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
};

let recipesList = [];
let selectedIngredients = [];
let selectedAppliances = [];
let selectedUstensils = [];
let searchTerm = "";
let openFilter = null;

let availableIngredients = [];
let availableAppliances = [];
let availableUstensils = [];

const recipesContainer = document.getElementById("recipes-container");
const searchInput = document.getElementById("search-input");
const clearSearchIcon = document.getElementById("clear-search");
const filterContainer = document.querySelector(".filter-container");
filterContainer.className = "flex gap-[66px]";

const tagContainer = document.createElement("div");
tagContainer.className = "flex flex-wrap gap-2 mt-[22px]";
filterContainer.after(tagContainer);

const recipeCount = createElement("div", "font-[Anton] text-[21px] text-[#1B1B1B] ml-auto self-center");

// Chargement initial des recettes
fetch("data/recipes.json")
  .then(response => response.json())
  .then(recipes => {
    recipesList = recipes;
    displayRecipes(recipes);
    updateFilterOptions(recipes);
    filterContainer.innerHTML = "";
    generateFilterSelect("Ingrédients", "ingredient", selectedIngredients);
    generateFilterSelect("Appareils", "appliance", selectedAppliances);
    generateFilterSelect("Ustensiles", "ustensil", selectedUstensils);
    filterContainer.appendChild(recipeCount); // Ajout ici au 1er chargement
  })
  .catch(error => console.error("Erreur lors du chargement des recettes :", error));

// Affichage des recettes
const displayRecipes = (recipes) => {
  recipesContainer.innerHTML = "";
  recipes.forEach(recipe => {
    const recipeCard = createRecipeCard(recipe);
    recipesContainer.appendChild(recipeCard);
  });
  recipeCount.textContent = `${recipes.length} recette${recipes.length > 1 ? "s" : ""}`;
};

// Création d'une carte recette
const createRecipeCard = (recipe) => {
  const recipeCard = createElement("div", "w-full max-w-sm bg-white rounded-[21px] shadow-md overflow-hidden");
  recipeCard.classList.add("relative");

  const recipeImage = createElement("img", "w-full h-[250px] object-cover rounded-t-lg");
  recipeImage.src = `assets/images/${recipe.image}`;
  recipeImage.alt = recipe.name;

  const recipeTime = createElement("div", "absolute top-[22px] right-[22px] bg-[#FFD15B] text-[#1B1B1B] font-[Manrope] font-normal text-[12px] leading-none text-center pt-[5px] pr-[15px] pb-[5px] pl-[15px] rounded-[14px]");
  recipeTime.textContent = `${recipe.time} min`;

  const recipeContent = createElement("div", "px-[25px] py-[32px]");
  const recipeTitle = createElement("h3", "font-[Anton] text-[18px] mb-[29px]", recipe.name);
  const recipeLabel = createElement("p", "font-[Manrope] uppercase font-bold text-[12px] mt-[29px] mb-[15px]", "Recette");
  const recipeDescription = createElement("p", "font-[Manrope] text-[14px] line-clamp-4 overflow-hidden mt-[15px]", recipe.description);
  const ingredientsLabel = createElement("p", "font-[Manrope] uppercase font-bold text-[12px] mt-[32px] mb-[15px]", "Ingrédients");
  const ingredientsList = createElement("ul", "grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-[15px]");

  recipe.ingredients.forEach(ingredient => {
    const ingredientItem = createElement("li", "flex flex-col");
    const ingredientName = createElement("span", "", ingredient.ingredient);
    const ingredientQuantity = createElement("span", "text-gray-600 text-sm", `${ingredient.quantity || ""} ${ingredient.unit || ""}`);
    ingredientItem.append(ingredientName, ingredientQuantity);
    ingredientsList.appendChild(ingredientItem);
  });

  recipeContent.append(recipeTitle, recipeLabel, recipeDescription, ingredientsLabel, ingredientsList);
  recipeCard.append(recipeImage, recipeTime, recipeContent);

  return recipeCard;
};

// Appliquer tous les filtres
const applyFilters = () => {
  let filteredRecipes = recipesList;

  if (searchTerm.length > 0) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm) ||
      recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(searchTerm))
    );
  }

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

  displayRecipes(filteredRecipes);
  updateFilterOptions(filteredRecipes);

  filterContainer.innerHTML = "";
  generateFilterSelect("Ingrédients", "ingredient", selectedIngredients);
  generateFilterSelect("Appareils", "appliance", selectedAppliances);
  generateFilterSelect("Ustensiles", "ustensil", selectedUstensils);
  filterContainer.appendChild(recipeCount); // Réinsertion après chaque filtre
};

// Met à jour les options de filtres selon les recettes restantes
const updateFilterOptions = (recipes) => {
  availableIngredients = [...new Set(recipes.flatMap(r => r.ingredients.map(i => i.ingredient)))];
  availableAppliances = [...new Set(recipes.map(r => r.appliance))];
  availableUstensils = [...new Set(recipes.flatMap(r => r.ustensils))];
};

// Recherche
searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.toLowerCase();
  applyFilters();
  renderTags();
  clearSearchIcon.classList.toggle("hidden", searchTerm.length === 0);
});

// Génère les filtres
const generateFilterSelect = (label, type, selectedArray) => {
  let itemsList = [];
  if (type === "ingredient") itemsList = availableIngredients;
  if (type === "appliance") itemsList = availableAppliances;
  if (type === "ustensil") itemsList = availableUstensils;

  const filterSelect = createElement("div", "relative bg-white rounded-[11px] p-4 w-[195px]");
  const filterSelectHeader = createElement("div", "flex justify-between items-center cursor-pointer", label);
  const arrowIcon = createElement("img", "w-4 h-4 transition-transform duration-200 ease-in-out");
  arrowIcon.src = "assets/utils/icons/arrow-down.svg";
  filterSelectHeader.appendChild(arrowIcon);

  const itemListContainer = createElement("div", `hidden absolute left-0 w-full bg-white shadow-lg rounded-lg p-4 z-50`);
  itemListContainer.dataset.type = type;

  const itemSearch = createElement("input", "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400");
  itemSearch.dataset.type = type;

  const itemScrollContainer = createElement("div", "max-h-[315px] overflow-y-auto mt-2 scrollbar-hide");

  itemsList.forEach(item => {
    const itemOption = createElement("div", `cursor-pointer py-1 px-2 hover:bg-[#FFD15B]`, item);
    itemOption.classList.add(`item-option-${type}`);
    itemOption.addEventListener("click", () => toggleFilter(item, itemOption, selectedArray));
    itemScrollContainer.appendChild(itemOption);
  });

  itemSearch.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    document.querySelectorAll(`.item-option-${type}`).forEach(item => {
      item.classList.toggle("hidden", !item.textContent.toLowerCase().includes(value));
    });
  });

  filterSelectHeader.addEventListener("click", () => {
    if (openFilter && openFilter !== itemListContainer) {
      openFilter.classList.add("hidden");
      openFilter.previousSibling.querySelector("img").style.transform = "rotate(0deg)";
    }
    const hidden = itemListContainer.classList.contains("hidden");
    itemListContainer.classList.toggle("hidden");
    arrowIcon.style.transform = hidden ? "rotate(180deg)" : "rotate(0deg)";
    openFilter = hidden ? itemListContainer : null;
  });

  document.addEventListener("click", (e) => {
    if (!filterSelect.contains(e.target)) {
      itemListContainer.classList.add("hidden");
      arrowIcon.style.transform = "rotate(0deg)";
      openFilter = null;
    }
  });

  itemListContainer.append(itemSearch, itemScrollContainer);
  filterSelect.append(filterSelectHeader, itemListContainer);
  filterContainer.appendChild(filterSelect);
};

// Toggle de tag
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
  renderTags();
};

// Affiche les tags sélectionnés
const renderTags = () => {
  tagContainer.innerHTML = "";

  const createTag = (text, array) => {
    const tag = createElement("div", "flex items-center bg-[#FFD15B] text-black px-4 py-2 rounded-[11px] font-[Manrope] text-sm");
    const span = createElement("span", "", text);
    const close = createElement("span", "ml-3 cursor-pointer text-xl font-bold", "×");

    close.addEventListener("click", () => {
      array.splice(array.indexOf(text), 1);
      applyFilters();
      renderTags();
    });

    tag.append(span, close);
    tagContainer.appendChild(tag);
  };

  selectedIngredients.forEach(i => createTag(i, selectedIngredients));
  selectedAppliances.forEach(a => createTag(a, selectedAppliances));
  selectedUstensils.forEach(u => createTag(u, selectedUstensils));
};

// Clear button
document.getElementById("clear-search").addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  applyFilters();
  renderTags();
  clearSearchIcon.classList.add("hidden");
});