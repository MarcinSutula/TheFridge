import { findUserRdx } from "../../components/utils/helpers";

export function addShoppingListItem(state, action) {
  const foundUser = findUserRdx(state, action);

  foundUser.shoppingList.push({
    name: action.payload.listItem,
    id: foundUser.shoppingListId,
  });
  foundUser.shoppingListId++;
}
