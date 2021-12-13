import { fridgeActions } from "../index";
import { ALERT_OTHER } from "../../components/control/config";
import { fetchFirestoreData } from "../../components/control/initFirebase";
import { getRecipesPayload } from "../../components/control/API payloads/getRecipesPayload";
import { getRecipeDescriptionPayload } from "../../components/control/API payloads/getRecipeDescriptionPayload";

export const recipesMiddleware =
  ({ dispatch, store }) =>
  (next) =>
  async (action) => {
    try {
      if (fridgeActions.addRecipe.match(action)) {
        await fetchFirestoreData(
          action.payload.user.id,
          "uptade",
          getRecipesPayload("add", action.payload.user, action.payload.recipe)
        );
      } else if (fridgeActions.editRecipe.match(action)) {
        await fetchFirestoreData(
          action.payload.user.id,
          "set",
          getRecipesPayload(
            "edit",
            action.payload.user,
            action.payload.recipe,
            action.payload.prevRecipe
          )
        );
      } else if (fridgeActions.removeRecipe.match(action)) {
        await fetchFirestoreData(
          action.payload.user.id,
          "set",
          getRecipesPayload(
            "remove",
            action.payload.user,
            action.payload.recipe
          )
        );
      } else if (fridgeActions.addDescription.match(action)) {
        await fetchFirestoreData(
          action.payload.user.id,
          "set",
          getRecipeDescriptionPayload(
            "add",
            action.payload.user,
            action.payload.recipeId,
            action.payload.description
          )
        );
      } else if (fridgeActions.removeDescription.match(action)) {
        await fetchFirestoreData(
          action.payload.user.id,
          "set",
          getRecipeDescriptionPayload(
            "remove",
            action.payload.user,
            action.payload.recipeId
          )
        );
      }
    } catch (err) {
      console.error(err);
      alert(ALERT_OTHER);
    }
    return next(action);
  };
