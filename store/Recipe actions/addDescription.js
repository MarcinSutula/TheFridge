import { findUser, findRecipe } from "../../components/utils/helpers";

export function addDescription(state, action) {
  const foundUser = findUser(state, action);
  const foundRecipe = findRecipe(foundUser, action);

  if (!foundUser || !foundRecipe) return;

  foundRecipe.description = action.payload.description;
}
