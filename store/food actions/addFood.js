import { getNumberFromStr } from "../../components/utils/helpers";
import { findUserRdx } from "../../components/utils/helpers";

export function addFood(state, action) {
  const foundUser = findUserRdx(state, action);

  foundUser.food.push({
    name: action.payload.food.foodName,
    type: action.payload.food.foodType,
    quantity: action.payload.food.foodQuantity,
    weight: action.payload.food.foodWeight,
    expDate: action.payload.food.foodExpDate,
    key: action.payload.user.foodId,
    id: action.payload.user.foodId,
  });
  foundUser.foodId++;
  foundUser.totalQuantity += +action.payload.food.foodQuantity;
  foundUser.totalWeight += getNumberFromStr(action.payload.food.foodWeight);
}
