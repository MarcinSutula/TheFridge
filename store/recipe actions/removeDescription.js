import { findUserRdx, findRecipeRdx } from "../../components/utils/helpers";

export function removeDescription(state, action) {
  const foundUser = findUserRdx(state, action);
  const foundRecipe = findRecipeRdx(foundUser, action);

  foundRecipe.description = "";
}
