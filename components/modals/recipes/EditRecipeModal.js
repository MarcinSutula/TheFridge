import modalClasses from "../../../styles/modalClasses.module.css";
import { maxLengthCheck } from "../../utils/helpers";
import {
  RECIPEINGREDIENTS_REGEX,
  RECIPENAME_MAX_LENGTH,
  RECIPESERVINGS_MAX_LENGTH,
  RECIPETIME_MAX_LENGTH,
  RECIPEINGREDIENTS_MAX_LENGTH,
  RECIPEINGREDIENTS_MAX_AMOUNT_OF_INPUTS,
} from "../../control/config";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../control/initFirebase";
import { useSelector, useDispatch } from "react-redux";
import { fridgeActions } from "../../../store/index";
import { useRef, useState } from "react";
import { Modal, Fade } from "@material-ui/core";

function EditRecipeModal(props) {
  const editRecipeName = useRef();
  const editRecipeServings = useRef();
  const editRecipeTime = useRef();
  const editRecipeDifficulty = useRef();
  const editRecipeImgURL = useRef();
  const ingredientRefs = [...Array(RECIPEINGREDIENTS_MAX_AMOUNT_OF_INPUTS)].map(
    () => useRef()
  );
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const foundUser = users.find((user) => user.id !== "");
  const foundRecipe = foundUser?.recipes.find(
    (recipe) => recipe.id === +props.recipeId
  );
  const recipeIngredients = foundRecipe?.ingredients;
  const [ingredientsInputAmount, setIngredientsInputAmount] = useState(
    recipeIngredients.length
  );

  const editRecipeModalOnCloseHandler = () => {
    props.setShowEditRecipeModal(false);
  };

  const ingredientsInputAmountHandler = (e) => {
    e.preventDefault();
    setIngredientsInputAmount((prevState) => {
      return prevState + (e.target.value === "+" ? 1 : -1);
    });
  };
  const submitEditRecipeHandler = async (e) => {
    try {
      e.preventDefault();
      const docRef = doc(db, "users", foundUser.id);
      const ingredientsArray = ingredientRefs
        .filter(
          (ref) =>
            ref?.current?.value !== undefined && ref?.current?.value !== ""
        )
        .map((ref) => ref.current.value);
      const recipesCopy = foundUser?.recipes.map((recipe) => ({ ...recipe }));
      const foundCopyRecipe = recipesCopy.find(
        (recipe) => recipe.id === +props.recipeId
      );

      if (
        editRecipeName.current.value.trim().length < 1 ||
        +editRecipeServings.current.value < 1 ||
        +editRecipeTime.current.value < 0 ||
        editRecipeDifficulty.current.value === "DEFAULT" ||
        !ingredientRefs.find((ref) => !!ref?.current?.value)
      ) {
        alert(
          "Values other than URL must not be empty. You must insert at least one ingredient"
        );
        return;
      } else if (
        ingredientsArray.find((ing) => !ing.match(RECIPEINGREDIENTS_REGEX))
      ) {
        alert("Ingredients must be kept in format: amount,name");
        return;
      }

      foundCopyRecipe.name = editRecipeName.current.value;
      foundCopyRecipe.servings = editRecipeServings.current.value;
      foundCopyRecipe.time = editRecipeTime.current.value;
      foundCopyRecipe.difficulty = editRecipeDifficulty.current.value;
      foundCopyRecipe.url = editRecipeImgURL.current.value;
      foundCopyRecipe.ingredients = ingredientsArray;

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

      dispatch(
        fridgeActions.editRecipe({
          username: foundUser.username,
          ...foundCopyRecipe,
        })
      );

      props.setShowEditRecipeModal(false);
    } catch (err) {
      alert("Something went wrong ! Please try again");
      console.error(err);
    }
  };
  const editRecipeModal = (
    <form className={modalClasses.main} onSubmit={submitEditRecipeHandler}>
      <div key={foundRecipe?.name}>
        <label>Name </label>
        <input
          type="text"
          defaultValue={foundRecipe?.name}
          ref={editRecipeName}
          autoFocus={true}
          maxLength={RECIPENAME_MAX_LENGTH}
          required
        />
      </div>
      <div key={foundRecipe?.servings}>
        <label>Servings </label>
        <input
          type="number"
          defaultValue={foundRecipe?.servings}
          ref={editRecipeServings}
          maxLength={RECIPESERVINGS_MAX_LENGTH}
          min="1"
          onInput={maxLengthCheck}
          required
        />
      </div>
      <div key={foundRecipe?.time}>
        <label>Time(min) </label>
        <input
          type="number"
          defaultValue={foundRecipe?.time}
          ref={editRecipeTime}
          maxLength={RECIPETIME_MAX_LENGTH}
          min="0"
          onInput={maxLengthCheck}
          required
        />
      </div>
      <div key={foundRecipe?.difficulty}>
        <label>Difficulty </label>
        <select
          name="difficultylistAddRecipe"
          id="difficultylistAddRecipe"
          defaultValue={foundRecipe.difficulty}
          ref={editRecipeDifficulty}
        >
          <option>easy</option>
          <option>medium</option>
          <option>hard</option>
        </select>
      </div>
      <div key={foundRecipe?.url}>
        <label>Image URL </label>
        <input
          type="url"
          ref={editRecipeImgURL}
          defaultValue={foundRecipe?.url}
        />
      </div>
      <div>
        <h2>Ingredients</h2>
        <h4>format: amount,name (i.e: 5g,salt)</h4>
      </div>
      {[...Array(ingredientsInputAmount)].map((recipe, i) => {
        return (
          <div key={i}>
            <label>Ingredient {i + 1}</label>
            <input
              type="text"
              ref={ingredientRefs[i]}
              maxLength={RECIPEINGREDIENTS_MAX_LENGTH}
              defaultValue={recipeIngredients[i]}
            />
          </div>
        );
      })}
      <div className={modalClasses.addRecipe_btn}>
        {ingredientsInputAmount !== RECIPEINGREDIENTS_MAX_AMOUNT_OF_INPUTS && (
          <button
            type="button"
            value="+"
            onClick={ingredientsInputAmountHandler}
          >
            +
          </button>
        )}
        {ingredientsInputAmount !== 1 && (
          <button
            type="button"
            value="-"
            onClick={ingredientsInputAmountHandler}
          >
            -
          </button>
        )}
      </div>
      <div className={modalClasses.btn_container}>
        <button>Confirm</button>
      </div>
    </form>
  );

  return (
    <Modal
      open={props.showEditRecipeModal}
      onClose={editRecipeModalOnCloseHandler}
    >
      <Fade in={props.showEditRecipeModal}>{editRecipeModal}</Fade>
    </Modal>
  );
}

export default EditRecipeModal;
