import { findUser } from "../../components/utils/helpers";

export function addRecipe(state, action) {
  const foundUser = findUser(state, action);

  if (!foundUser) return;
  foundUser.recipes.push({
    name: action.payload.name,
    servings: action.payload.servings,
    time: action.payload.time,
    difficulty: action.payload.difficulty,
    url: action.payload.url,
    ingredients: action.payload.ingredients,
    description: "",
    id: action.payload.id,
  });
  foundUser.recipesId++;
}
