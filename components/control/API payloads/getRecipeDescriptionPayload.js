export function getRecipeDescriptionPayload(
  action,
  user,
  recipeId,
  description
) {
  //Increment works only on uptadeDoc
  //Impossible to uptade choosen object in array of objects in Firebase
  const recipesCopy = user.recipes.map((recipe) => ({ ...recipe }));
  const foundCopyRecipe = recipesCopy.find((recipe) => recipe.id === +recipeId);

  const payload = {
    username: user.username,
    recipesId: user.recipesId,
    foodId: user.foodId,
    shoppingListId: user.shoppingListId,
    totalWeight: user.totalWeight,
    totalQuantity: user.totalQuantity,
    food: user.food,
    shoppingList: user.shoppingList,
  };

  switch (action) {
    case "add":
      foundCopyRecipe.description = description.recipeDescription;
      payload.recipes = recipesCopy;

      return payload;

    case "remove":
      foundCopyRecipe.description = "";
      payload.recipes = recipesCopy;

      return payload;

    default:
      throw new Error("No such action");
  }
}
