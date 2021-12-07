import { getNumberFromStr } from "../../components/utils/helpers";
import { findUserRdx } from "../../components/utils/helpers";

export function removeFood(state, action) {
  const foundUser = findUserRdx(state, action);
  if (!foundUser) return;
  foundUser.food = foundUser.food.filter((item) => {
    return item.id !== action.payload.food.id;
  });
  foundUser.totalQuantity -= +action.payload.food.quantity;
  foundUser.totalWeight -= getNumberFromStr(action.payload.food.weight);
}
