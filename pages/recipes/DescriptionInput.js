import { useRouter } from "next/router";
import { useRef, Fragment } from "react";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import classes from "./recipeDetails.module.css";
import { fetchFirestoreData } from "../../components/control/initFirebase";
import {
  RECIPEDESCRIPTION_MAX_LENGTH,
  ALERT_OTHER,
} from "../../components/control/config";
import { findUser, findRecipe } from "../../components/utils/helpers";

function DescriptionInput(props) {
  const addDescription = useRef();
  const dispatch = useDispatch();
  const router = useRouter();
  const recipeId = router.query.recipeId;
  const foundUser = findUser();
  const foundRecipe = findRecipe(recipeId);
  const recipeDescription = foundRecipe?.description;

  const addDescriptionHandler = async (e) => {
    try {
      e.preventDefault();
      const recipesCopy = foundUser?.recipes.map((recipe) => ({ ...recipe }));
      const foundCopyRecipe = recipesCopy.find(
        (recipe) => recipe.id === +recipeId
      );
      foundCopyRecipe.description = addDescription.current.value;

      const payload = {
        username: foundUser.username,
        recipesId: foundUser.recipesId,
        foodId: foundUser.foodId,
        totalQuantity: foundUser.totalQuantity,
        totalWeight: foundUser.totalWeight,
        recipes: recipesCopy,
        food: foundUser.food,
      };

      await fetchFirestoreData(foundUser.id, "set", payload);

      dispatch(
        fridgeActions.addDescription({
          username: foundUser.username,
          id: foundRecipe.id,
          description: foundCopyRecipe.description,
        })
      );
      props.setShowDescriptionInput(false);
      foundCopyRecipe.description
        ? props.setShowDescription(true)
        : props.setShowDescription(false);
    } catch (err) {
      alert(ALERT_OTHER);
      console.error(err);
    }
  };

  const cancelDescriptionHandler = () => {
    props.setShowDescriptionInput(false);
    foundRecipe.description
      ? props.setShowDescription(true)
      : props.setShowDescription(false);
  };

  return (
    <Fragment>
      <div
        className={classes.long_desc_input}
        key={recipeDescription ? recipeDescription : ""}
      >
        <textarea
          type="text"
          maxLength={RECIPEDESCRIPTION_MAX_LENGTH}
          ref={addDescription}
          autoFocus={true}
          defaultValue={recipeDescription ? recipeDescription : ""}
        />
      </div>
      <div className={classes.long_desc_input_btn}>
        <button onClick={addDescriptionHandler}>Confirm</button>
        <button type="button" onClick={cancelDescriptionHandler}>
          Cancel
        </button>
      </div>
    </Fragment>
  );
}

export default DescriptionInput;
