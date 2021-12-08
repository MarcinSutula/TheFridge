import { fridgeActions } from ".";
import { ALERT_OTHER } from "../components/control/config";
import { fetchFirestoreData } from "../components/control/initFirebase";
import { getFoodPayload } from "../components/control/getFoodPayload";

export const foodMiddleware =
  ({ dispatch, store }) =>
  (next) =>
  async (action) => {
    try {
      if (fridgeActions.addFood.match(action)) {
        await fetchFirestoreData(
          action.payload.user.id,
          "uptade",
          getFoodPayload("add", action.payload.user, action.payload.food)
        );
      } else if (fridgeActions.editFood.match(action)) {
        await fetchFirestoreData(
          action.payload.user.id,
          "set",
          getFoodPayload(
            "edit",
            action.payload.user,
            action.payload.food,
            action.payload.prevFood
          )
        );
      } else if (fridgeActions.removeFood.match(action)) {
        await fetchFirestoreData(
          action.payload.user.id,
          "set",
          getFoodPayload("remove", action.payload.user, action.payload.food)
        );
      }
    } catch (err) {
      console.error(err);
      alert(ALERT_OTHER);
    }
    return next(action);
  };
