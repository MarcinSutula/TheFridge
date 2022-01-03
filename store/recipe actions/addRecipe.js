import { findUserRdx } from "../../components/utils/helpers";

export function addRecipe(state, action) {
  const foundUser = findUserRdx(state, action);
  foundUser.recipes.push({
    name: action.payload.recipe.recipeName,
    servings: action.payload.recipe.recipeServings,
    time: action.payload.recipe.recipeTime,
    difficulty: action.payload.recipe.recipeDifficulty,
    url: action.payload.recipe.recipeImgURL,
    ingredients: action.payload.recipe.ingredients.map((ing) => ing.ingName),
    id: action.payload.user.recipesId,
    description: "",
  });
  foundUser.recipesId++;
}
