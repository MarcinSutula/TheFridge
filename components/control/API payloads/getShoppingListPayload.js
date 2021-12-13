import { arrayUnion, increment } from "@firebase/firestore";

export function getShoppingListPayload(action, user, listItem) {
  //Increment works only on uptadeDoc
  //Impossible to uptade choosen object in array of objects in Firebase
  let payload;

  switch (action) {
    case "add":
      payload = {
        shoppingList: arrayUnion({
          name: listItem,
          id: user.shoppingListId,
        }),
        shoppingListId: increment(1),
      };

      return payload;

    case "remove":
      const filteredShoppingList = user.shoppingList.filter(
        (ele) => ele.id !== listItem.id
      );

      payload = {
        username: user.username,
        foodId: user.foodId,
        recipesId: user.recipesId,
        shoppingListId: user.shoppingListId,
        recipes: user.recipes,
        totalWeight: user.totalWeight,
        totalQuantity: user.totalQuantity,
        food: user.food,
        shoppingList: filteredShoppingList,
      };
      return payload;

    default:
      throw new Error("No such action");
  }
}
