import modalClasses from "../../../styles/modalClasses.module.css";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../../store/index";
import { Modal, Fade } from "@material-ui/core";
import { useRouter } from "next/router";
import { FindUser, findRecipe } from "../../utils/helpers";

function RemoveRecipeModal(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const foundUser = FindUser();
  const foundRecipe = findRecipe(props.recipeId);

  const removeRecipeModalOnCloseHandler = () => {
    props.setShowRemoveRecipeModal(false);
  };

  const removeRecipeHandler = (e) => {
    e.preventDefault();

    dispatch(
      fridgeActions.removeRecipe({
        user: foundUser,
        recipe: foundRecipe,
      })
    );
    router.replace("/recipes");
    props.setShowRemoveRecipeModal(false);
  };
  const removeRecipeModal = (
    <div className={modalClasses.main}>
      <h2>Are you sure you want to remove the recipe ?</h2>
      <div className={modalClasses.yesno_btn}>
        <button onClick={removeRecipeHandler}>Yes</button>
        <button onClick={removeRecipeModalOnCloseHandler}>No</button>
      </div>
    </div>
  );

  return (
    <Modal
      open={props.showRemoveRecipeModal}
      onClose={removeRecipeModalOnCloseHandler}
    >
      <Fade in={props.showRemoveRecipeModal}>{removeRecipeModal}</Fade>
    </Modal>
  );
}

export default RemoveRecipeModal;
