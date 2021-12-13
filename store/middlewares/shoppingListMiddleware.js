import { fridgeActions } from "../index";
import { ALERT_OTHER } from "../../components/control/config";
import { fetchFirestoreData } from "../../components/control/initFirebase";
import { getShoppingListPayload } from "../../components/control/API payloads/getShoppingListPayload";

export const shoppingListMiddleware =
  ({ dispatch, store }) =>
  (next) =>
  async (action) => {
    try {
      if (fridgeActions.addShoppingListItem.match(action)) {
        await fetchFirestoreData(
          action.payload.user.id,
          "uptade",
          getShoppingListPayload(
            "add",
            action.payload.user,
            action.payload.listItem
          )
        );
      } else if (fridgeActions.removeShoppingListItem.match(action)) {
        await fetchFirestoreData(
          action.payload.user.id,
          "set",
          getShoppingListPayload(
            "remove",
            action.payload.user,
            action.payload.listItem
          )
        );
      }
    } catch (err) {
      console.error(err);
      alert(ALERT_OTHER);
    }
    return next(action);
  };
