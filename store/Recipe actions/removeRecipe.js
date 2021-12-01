import { findUserRdx } from "../../components/utils/helpers";

export function removeRecipe(state, action) {
  const foundUser = findUserRdx(state, action);

  foundUser.recipes = foundUser.recipes.filter((recipe) => {
    return recipe.id !== +action.payload.recipeId;
  });
}
