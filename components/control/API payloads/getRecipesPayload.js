import { arrayUnion, increment } from "@firebase/firestore";

export function getRecipesPayload(action, user, recipe, prevRecipe) {
  //Increment works only on uptadeDoc
  //Impossible to uptade choosen object in array of objects in Firebase
  const ingredientsArray = recipe.ingredients.map((ing) => ing.ingName);
  let payload;

  switch (action) {
    case "add":
      payload = {
        recipes: arrayUnion({
          name: recipe.recipeName,
          servings: recipe.recipeServings,
          time: recipe.recipeTime,
          difficulty: recipe.recipeDifficulty,
          url: recipe.recipeImgURL,
          ingredients: ingredientsArray,
          id: user.recipesId,
          description: "",
        }),
        recipesId: increment(1),
      };
      return payload;

    case "edit":
      const recipesCopy = user.recipes.map((recipe) => ({ ...recipe }));
      const foundCopyRecipe = recipesCopy.find(
        (recipe) => recipe.id === +prevRecipe.id
      );

      foundCopyRecipe.name = recipe.recipeName;
      foundCopyRecipe.servings = recipe.recipeServings;
      foundCopyRecipe.time = recipe.recipeTime;
      foundCopyRecipe.difficulty = recipe.recipeDifficulty;
      foundCopyRecipe.url = recipe.recipeImgURL;
      foundCopyRecipe.ingredients = ingredientsArray;

      payload = {
        username: user.username,
        recipesId: user.recipesId,
        foodId: user.foodId,
        shoppingListId: user.shoppingListId,
        totalWeight: user.totalWeight,
        totalQuantity: user.totalQuantity,
        food: user.food,
        shoppingList: user.shoppingList,
        recipes: recipesCopy,
      };
      return payload;

    case "remove":
      const recipesFiltered = user.recipes.filter(
        (ele) => ele.id !== recipe.id
      );
      payload = {
        username: user.username,
        foodId: user.foodId,
        recipesId: user.recipesId,
        shoppingListId: user.shoppingListId,
        totalWeight: user.totalWeight,
        totalQuantity: user.totalQuantity,
        food: user.food,
        shoppingList: user.shoppingList,
        recipes: recipesFiltered,
      };
      return payload;

    default:
      throw new Error("No such action");
  }
}
