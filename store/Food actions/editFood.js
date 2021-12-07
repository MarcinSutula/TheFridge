import { getNumberFromStr } from "../../components/utils/helpers";
import { findUserRdx } from "../../components/utils/helpers";

export function editFood(state, action) {
  const foundUser = findUserRdx(state, action);
  const foundUserFood = foundUser.food.find(
    (ele) => +ele.id === +action.payload.prevFood.id
  );

  if (!foundUser) return;
  foundUser.totalQuantity =
    foundUser.totalQuantity -
    foundUserFood.quantity +
    +action.payload.food.foodQuantity;
  foundUser.totalWeight =
    foundUser.totalWeight -
    getNumberFromStr(foundUserFood.weight) +
    getNumberFromStr(action.payload.food.foodWeight);

  foundUserFood.name = action.payload.food.foodName;
  foundUserFood.type = action.payload.food.foodType;
  foundUserFood.quantity = action.payload.food.foodQuantity;
  foundUserFood.weight = action.payload.food.foodWeight;
  foundUserFood.expDate = action.payload.food.foodExpDate;
}
