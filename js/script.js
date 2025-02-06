// Sélection de l'élément où afficher les recettes
const recipesContainer = document.getElementById("recipes-container");

// Charger les données depuis le fichier JSON
fetch("data/recipes.json")
  .then((response) => response.json())
  .then((recipes) => {
    recipes.forEach((recipe) => {
      // Création de l'élément de la recette
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("recipe-card", "p-4", "bg-white", "shadow-lg", "rounded-lg");

      // Image de la recette
      const recipeImage = document.createElement("img");
      recipeImage.src = `assets/images/${recipe.image}`;
      recipeImage.alt = recipe.name;
      recipeImage.classList.add("w-full", "h-40", "object-cover", "rounded-t-lg");
      console.log(recipeImage.src)

      // Nom de la recette
      const recipeTitle = document.createElement("h3");
      recipeTitle.textContent = recipe.name;
      recipeTitle.classList.add("text-lg", "font-bold", "mt-2");

      // Liste des ingrédients
      const ingredientsList = document.createElement("ul");
      ingredientsList.classList.add("text-sm", "mt-2");

      recipe.ingredients.forEach((ingredient) => {
        const ingredientItem = document.createElement("li");
        ingredientItem.textContent = `${ingredient.ingredient} - ${ingredient.quantity || ""} ${ingredient.unit || ""}`;
        ingredientsList.appendChild(ingredientItem);
      });

      // Ajouter les éléments à la carte de la recette
      recipeCard.appendChild(recipeImage);
      recipeCard.appendChild(recipeTitle);
      recipeCard.appendChild(ingredientsList);

      // Ajouter la carte au container
      recipesContainer.appendChild(recipeCard);
    });
  })
  .catch((error) => console.error("Erreur lors du chargement des recettes :", error));