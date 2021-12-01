import modalClasses from "../../../styles/modalClasses.module.css";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../control/initFirebase";
import { useSelector, useDispatch } from "react-redux";
import { fridgeActions } from "../../../store/index";
import { Modal, Fade } from "@material-ui/core";
import { useRouter } from "next/router";

function RemoveRecipeModal(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const foundUser = users.find((user) => user.id !== "");
  const foundRecipe = foundUser?.recipes.find(
    (recipe) => recipe.id === +props.recipeId
  );

  const removeRecipeModalOnCloseHandler = () => {
    props.setShowRemoveRecipeModal(false);
  };

  const removeRecipeHandler = async (e) => {
    try {
      e.preventDefault();

      const docRef = doc(db, "users", foundUser.id);

      const filteredRecipes = foundUser.recipes.filter(
        (recipe) => recipe.id !== foundRecipe.id
      );
      const payload = {
        username: foundUser.username,
        recipesId: foundUser.recipesId,
        foodId: foundUser.foodId,
        totalQuantity: foundUser.totalQuantity,
        totalWeight: foundUser.totalWeight,
        recipes: filteredRecipes,
        food: foundUser.food,
      };

      await setDoc(docRef, payload);

      dispatch(
        fridgeActions.removeRecipe({
          username: foundUser.username,
          recipeId: foundRecipe.id,
        })
      );
      router.replace("/recipes");
      props.setShowRemoveRecipeModal(false);
    } catch (err) {
      alert("Something went wrong ! Please try again");
      console.error(err);
    }
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
