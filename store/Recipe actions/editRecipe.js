import { findUserRdx, findRecipeRdx } from "../../components/utils/helpers";

export function editRecipe(state, action) {
  const foundUser = findUserRdx(state, action);
  const foundRecipe = findRecipeRdx(foundUser, action);

  foundRecipe.name = action.payload.recipe.recipeName;
  foundRecipe.servings = action.payload.recipe.recipeServings;
  foundRecipe.time = action.payload.recipe.recipeTime;
  foundRecipe.difficulty = action.payload.recipe.recipeDifficulty;
  foundRecipe.url = action.payload.recipe.recipeImgURL;
  foundRecipe.ingredients = action.payload.recipe.ingredients.map(
    (ing) => ing.ingName
  );
}
