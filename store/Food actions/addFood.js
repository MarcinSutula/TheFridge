import { getNumberFromStr } from "../../components/utils/helpers";
import { findUserRdx } from "../../components/utils/helpers";

export function addFood(state, action) {
  const foundUser = findUserRdx(state, action);

  if (!foundUser) return;
  foundUser.food.push({
    name: action.payload.name,
    type: action.payload.type,
    quantity: action.payload.quantity,
    weight: action.payload.weight,
    expDate: action.payload.expDate,
    key: action.payload.key,
    id: action.payload.key,
  });
  foundUser.foodId++;
  foundUser.totalQuantity += +action.payload.quantity;
  foundUser.totalWeight += getNumberFromStr(action.payload.weight);
}
