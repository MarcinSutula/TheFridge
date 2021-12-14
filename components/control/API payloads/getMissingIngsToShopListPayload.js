import { arrayUnion, increment } from "@firebase/firestore";
import { filterIngsFromFood } from "../../utils/helpers";

export function getMissingIngsToShopListPayload(action, user, ingredients) {
  //Increment works only on uptadeDoc
  //Impossible to uptade choosen object in array of objects in Firebase
  let payload;

  switch (action) {
    case "add":
      const filteredIngs = filterIngsFromFood(ingredients, user.food);

      if (!filteredIngs) return;

      payload = {
        shoppingList: arrayUnion(
          ...filteredIngs.map((ing, i) => {
            return { name: ing, id: +user.shoppingListId + i };
          })
        ),
        shoppingListId: increment(filteredIngs.length),
      };
      return payload;

    default:
      throw new Error("No such action");
  }
}
