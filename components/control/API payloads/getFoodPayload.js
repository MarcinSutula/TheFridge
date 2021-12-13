import { arrayUnion, increment } from "@firebase/firestore";
import { getNumberFromStr } from "../../utils/helpers";

export function getFoodPayload(action, user, food, prevFood) {
  //Increment works only on uptadeDoc
  //Impossible to uptade choosen object in array of objects in Firebase
  let payload;
  switch (action) {
    case "add":
      payload = {
        food: arrayUnion({
          name: food.foodName,
          type: food.foodType,
          quantity: food.foodQuantity,
          weight: food.foodWeight,
          expDate: food.foodExpDate,
          id: user.foodId,
        }),
        foodId: increment(1),
        totalWeight: increment(getNumberFromStr(food.foodWeight)),
        totalQuantity: increment(+food.foodQuantity),
      };
      return payload;

    case "edit":
      const foodCopy = [...user.food];
      const userEditFoodIndex = foodCopy.findIndex(
        (ele) => +ele.id === +prevFood.id
      );

      foodCopy[userEditFoodIndex] = {
        name: food.foodName,
        type: food.foodType,
        quantity: food.foodQuantity,
        weight: food.foodWeight,
        expDate: food.foodExpDate,
        id: prevFood.id,
      };

      payload = {
        username: user.username,
        recipesId: user.recipesId,
        foodId: user.foodId,
        shoppingListId: user.shoppingListId,
        recipes: user.recipes,
        shoppingList: user.shoppingList,
        totalWeight:
          user.totalWeight -
          getNumberFromStr(prevFood.weight) +
          getNumberFromStr(food.foodWeight),
        totalQuantity:
          user.totalQuantity - +prevFood.quantity + +food.foodQuantity,
        food: foodCopy,
      };
      return payload;

    case "remove":
      //careful, different food obj
      const foodFiltered = user.food.filter((ele) => ele.id !== food.id);
      payload = {
        username: user.username,
        foodId: user.foodId,
        recipesId: user.recipesId,
        shoppingListId: user.shoppingListId,
        recipes: user.recipes,
        shoppingList: user.shoppingList,
        totalWeight: user.totalWeight - getNumberFromStr(food.weight),
        totalQuantity: user.totalQuantity - +food.quantity,
        food: foodFiltered,
      };
      return payload;

    default:
      throw new Error("No such action");
  }
}
