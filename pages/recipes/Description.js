import classes from "./recipeDetails.module.css";
import { Fragment } from "react";
import { findUser, findRecipe } from "../../components/utils/helpers";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import { useRouter } from "next/router";
import Spinner from "../../components/utils/Spinner";

function Description(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const recipeId = router.query.recipeId;
  const foundUser = findUser();
  const foundRecipe = findRecipe(recipeId);

  const removeDescriptionHandler = async (e) => {
    e.preventDefault();

    dispatch(
      fridgeActions.removeDescription({
        user: foundUser,
        recipeId,
      })
    );

    props.setShowDescription(false);
  };

  const editDescriptionHandler = () => {
    props.setShowDescriptionInput(true);
    props.setShowDescription(false);
  };

  return (
    <Fragment>
      <div className={classes.long_desc_text}>
        {foundRecipe.description && <text>{foundRecipe.description}</text>}
        {!foundRecipe.description && <Spinner />}
      </div>
      <div className={classes.long_desc_text_btn}>
        <button onClick={editDescriptionHandler}>Edit</button>
        <button onClick={removeDescriptionHandler}>Remove</button>
      </div>
    </Fragment>
  );
}

export default Description;
