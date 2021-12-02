import classes from "./recipeDetails.module.css";
import { Fragment } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../components/control/initFirebase";
import { findUser, findRecipe } from "../../components/utils/helpers";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import { ALERT_OTHER } from "../../components/control/config";
import { useRouter } from "next/router";

function Description(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const recipeId = router.query.recipeId;
  const foundUser = findUser();
  const foundRecipe = findRecipe(recipeId);

  const removeDescriptionHandler = async (e) => {
    try {
      e.preventDefault();

      const docRef = doc(db, "users", foundUser.id);
      const recipesCopy = foundUser?.recipes.map((recipe) => ({ ...recipe }));

      const foundCopyRecipe = recipesCopy.find(
        (recipe) => recipe.id === +recipeId
      );
      foundCopyRecipe.description = "";

      const payload = {
        username: foundUser.username,
        recipesId: foundUser.recipesId,
        foodId: foundUser.foodId,
        totalQuantity: foundUser.totalQuantity,
        totalWeight: foundUser.totalWeight,
        recipes: recipesCopy,
        food: foundUser.food,
      };

      await setDoc(docRef, payload);

      props.setShowDescription(false);

      dispatch(
        fridgeActions.removeDescription({
          username: foundUser.username,
          id: foundRecipe.id,
        })
      );
    } catch (err) {
      alert(ALERT_OTHER);
      console.error(err);
    }
  };

  const editDescriptionHandler = () => {
    props.setShowDescriptionInput(true);
    props.setShowDescription(false);
  };

  return (
    <Fragment>
      <div className={classes.long_desc_text}>
        <text>{foundRecipe.description}</text>
      </div>
      <div className={classes.long_desc_text_btn}>
        <button onClick={editDescriptionHandler}>Edit</button>
        <button onClick={removeDescriptionHandler}>Remove</button>
      </div>
    </Fragment>
  );
}

export default Description;
