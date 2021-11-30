import { getNumberFromStr } from "../../components/utils/helpers";
import { findUser } from "../../components/utils/helpers";

export function editFood(state, action) {
  const foundUser = findUser(state, action);
  const foundUserFood = foundUser.food.find(
    (ele) => +ele.id === +action.payload.id
  );

  if (!foundUser) return;
  foundUser.totalQuantity =
    foundUser.totalQuantity - foundUserFood.quantity + +action.payload.quantity;
  foundUser.totalWeight =
    foundUser.totalWeight -
    getNumberFromStr(foundUserFood.weight) +
    getNumberFromStr(action.payload.weight);

  foundUserFood.name = action.payload.name;
  foundUserFood.type = action.payload.type;
  foundUserFood.quantity = action.payload.quantity;
  foundUserFood.weight = action.payload.weight;
  foundUserFood.expDate = action.payload.expDate;
}
