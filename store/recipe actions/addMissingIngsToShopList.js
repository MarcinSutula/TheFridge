import { findUserRdx, filterIngsFromFood } from "../../components/utils/helpers";

export function addMissingIngsToShopList(state, action) {
  const foundUser = findUserRdx(state, action);
  const filteredIngs = filterIngsFromFood(
    action.payload.ingredients,
    foundUser.food
  );
  if (filteredIngs)
    filteredIngs.forEach((ing) => {
      foundUser.shoppingList.push({ name: ing, id: foundUser.shoppingListId });
      foundUser.shoppingListId++;
    });
}
