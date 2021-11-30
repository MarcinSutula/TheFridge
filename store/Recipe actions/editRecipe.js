import { findUser, findRecipe } from "../../components/utils/helpers";

export function editRecipe(state, action) {
  const foundUser = findUser(state, action);
  const foundRecipe = findRecipe(foundUser, action);
  
  if (!foundUser || !foundRecipe) return;
  foundRecipe.name = action.payload.name;
  foundRecipe.servings = action.payload.servings;
  foundRecipe.time = action.payload.time;
  foundRecipe.difficulty = action.payload.difficulty;
  foundRecipe.url = action.payload.url;
  foundRecipe.ingredients = action.payload.ingredients;
}
