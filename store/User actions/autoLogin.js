import { findUserRdx } from "../../components/utils/helpers";

export function autoLogin(state, action) {
  const foundUser = findUserRdx(state, action);
  if (foundUser) {
    foundUser.id = action.payload.id;
  } else {
    state.users.push({
      username: action.payload.user.username,
      id: action.payload.id,
      foodId: action.payload.user.foodId,
      recipesId: action.payload.user.recipesId,
      shoppingListId: action.payload.user.shoppingListId,
      totalQuantity: action.payload.user.totalQuantity,
      totalWeight: action.payload.user.totalWeight,
      food: action.payload.user.food,
      recipes: action.payload.user.recipes,
      shoppingList: action.payload.user.shoppingList,
    });
  }
}
