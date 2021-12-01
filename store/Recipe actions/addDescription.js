import { findUserRdx, findRecipeRdx } from "../../components/utils/helpers";

export function addDescription(state, action) {
  const foundUser = findUserRdx(state, action);
  const foundRecipe = findRecipeRdx(foundUser, action);

  if (!foundUser || !foundRecipe) return;

  foundRecipe.description = action.payload.description;
}
