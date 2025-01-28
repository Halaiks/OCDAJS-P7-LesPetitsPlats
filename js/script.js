fetch('data/recipes.json')
  .then(response => response.json())
  .then(recipes => {
    const container = document.getElementById('recipes-container');
    // Utiliser une grille 3 colonnes
    container.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'gap-6'); // 1 colonne mobile, 2 pour les tablettes, 3 pour les ordinateurs de bureau
    
    recipes.forEach(recipe => {
      const recipeElement = document.createElement('div');
      recipeElement.classList.add('bg-white', 'rounded-lg', 'shadow-lg');
      recipeElement.innerHTML = `
        <img src="assets/images/${recipe.image}" alt="${recipe.name}" class="w-full h-48 object-cover rounded-t-lg">
        <h2 class="text-xl font-semibold text-gray-800 mt-4 text-center">${recipe.name}</h2>
      `;
      container.appendChild(recipeElement);
    });
  })
  .catch(error => console.error('Erreur lors de la récupération des recettes :', error));