import { getNumberFromStr } from "../../components/utils/helpers";
import { findUserRdx } from "../../components/utils/helpers";

export function removeFood(state, action) {
  const foundUser = findUserRdx(state, action);
  if(!foundUser) return;
  foundUser.food = foundUser.food.filter((item) => {
    return item.key !== action.payload.foodToRemove.key;
  });
  foundUser.totalQuantity -= +action.payload.foodToRemove.quantity;
  foundUser.totalWeight -= getNumberFromStr(action.payload.foodToRemove.weight);
}
