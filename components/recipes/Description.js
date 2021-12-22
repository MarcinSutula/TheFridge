import classes from "./Description.module.css";
import { Fragment } from "react";
import { FindUser, findRecipe } from "../utils/helpers";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import { useRouter } from "next/router";
import Spinner from "../utils/Spinner";

function Description(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const recipeId = router.query.recipeId;
  const foundUser = FindUser();
  const foundRecipe = findRecipe(recipeId);

  const removeDescriptionHandler = (e) => {
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
      <div className={classes.desc_bq}>
        {foundRecipe?.description && <blockquote>{foundRecipe?.description}</blockquote>}
        {!foundRecipe?.description && <Spinner />}
      </div>
      <div className={classes.desc_btn}>
        <button onClick={editDescriptionHandler}>Edit</button>
        <button onClick={removeDescriptionHandler}>Remove</button>
      </div>
    </Fragment>
  );
}

export default Description;
