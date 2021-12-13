import { findUserRdx } from "../../components/utils/helpers";

export function removeShoppingListItem(state, action) {
  const foundUser = findUserRdx(state, action);

  foundUser.shoppingList = foundUser.shoppingList.filter((ele) => {
    return ele.id !== action.payload.listItem.id;
  });
}
