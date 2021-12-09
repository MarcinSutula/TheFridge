import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import classes from "./DescriptionInput.module.css";
import { RECIPEDESCRIPTION_MAX_LENGTH } from "../../components/control/config";
import { findUser, findRecipe } from "../../components/utils/helpers";
import { useForm } from "react-hook-form";

function DescriptionInput(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const recipeId = router.query.recipeId;
  const foundUser = findUser();
  const foundRecipe = findRecipe(recipeId);
  const recipeDescription = foundRecipe?.description;
  const { register, handleSubmit, reset } = useForm();

  const addDescriptionHandler = async (data) => {
    dispatch(
      fridgeActions.addDescription({
        user: foundUser,
        description: data,
        recipeId,
      })
    );
    props.setShowDescriptionInput(false);
    data.recipeDescription
      ? props.setShowDescription(true)
      : props.setShowDescription(false);
    reset();
  };

  const cancelDescriptionHandler = () => {
    props.setShowDescriptionInput(false);
    recipeDescription
      ? props.setShowDescription(true)
      : props.setShowDescription(false);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(addDescriptionHandler)}>
      <div
        className={classes.desc_input}
        key={recipeDescription ? recipeDescription : ""}
      >
        <textarea
          {...register("recipeDescription")}
          maxLength={RECIPEDESCRIPTION_MAX_LENGTH}
          defaultValue={recipeDescription ? recipeDescription : ""}
        />
      </div>
      <div className={classes.desc_input_btn}>
        <button>Confirm</button>
        <button type="button" onClick={cancelDescriptionHandler}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default DescriptionInput;
