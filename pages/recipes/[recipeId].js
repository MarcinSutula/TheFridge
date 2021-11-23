import { useRouter } from "next/router";
import withAuth from "../../components/control/withAuth";
import { useState, useEffect, useRef, Fragment, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import classes from "./recipeDetails.module.css";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../components/control/initFirebase";
import { Modal, Fade } from "@material-ui/core";
import modalClasses from "../../styles/modalClasses.module.css";
import {
  RECIPETIME_MAX_LENGTH,
  RECIPESERVINGS_MAX_LENGTH,
  RECIPENAME_MAX_LENGTH,
  RECIPEINGREDIENTS_MAX_LENGTH,
  RECIPEINGREDIENTS_MAX_AMOUNT_OF_INPUTS,
} from "../../components/control/config";
import { maxLengthCheck } from "../../components/utils/helpers";

function RecipeDetails() {
  const [mounted, setMounted] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showEditRecipeModal, setShowEditRecipeModal] = useState(false);
  const [ingredientsInputAmount, setIngredientsInputAmount] = useState(1);
  const router = useRouter();
  const dispatch = useDispatch();
  const addDescription = useRef();
  const editRecipeName = useRef();
  const editRecipeServings = useRef();
  const editRecipeTime = useRef();
  const editRecipeDifficulty = useRef();
  const editRecipeImgURL = useRef();
  const ingredientRefs = [...Array(RECIPEINGREDIENTS_MAX_AMOUNT_OF_INPUTS)].map(
    () => useRef()
  );
  const recipeId = router.query.recipeId;
  const users = useSelector((state) => state.users);
  const foundUser = users.find((user) => user.id !== null);
  const foundRecipe = foundUser?.recipes.find(
    (recipe) => recipe.id === +recipeId
  );
  const recipeDescription = foundRecipe?.description;
  const recipeIngredients = foundRecipe?.ingredients;

  useEffect(() => {
    if (recipeDescription) {
      setShowDescription(true);
    }

    setMounted(true);
  }, [recipeDescription]);

  useEffect(() => {
    if (recipeIngredients) {
      setIngredientsInputAmount(recipeIngredients.length);
    }
  }, [recipeIngredients]);

  if (!foundRecipe)
    return (
      mounted && (
        <div className={classes.background}>
          <div className={classes.temporary}>
            <p>No such Recipe</p>
          </div>
        </div>
      )
    );

  ///////////////////// DESCRIPTION HANDLERS ////////////////

  const addDescriptionHandler = async (e) => {
    try {
      e.preventDefault();

      // if (!addDescription.current.value) {
      //   setShowDescriptionInput(false)
      //   return;
      // }
      const docRef = doc(db, "users", foundUser.id);
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

      await setDoc(docRef, payload);

      dispatch(
        fridgeActions.addDescription({
          username: foundUser.username,
          recipeId: foundRecipe.id,
          description: foundCopyRecipe.description,
        })
      );
      setShowDescriptionInput(false);
      foundCopyRecipe.description
        ? setShowDescription(true)
        : setShowDescription(false);
    } catch (err) {
      alert("Something went wrong ! Please try again");
      console.error(err);
    }
  };

  const cancelDescriptionHandler = () => {
    setShowDescriptionInput(false);
    foundRecipe.description
      ? setShowDescription(true)
      : setShowDescription(false);
  };

  const editDescriptionHandler = () => {
    setShowDescriptionInput(true);
    setShowDescription(false);
  };

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

      setShowDescription(false);

      dispatch(
        fridgeActions.removeDescription({
          username: foundUser.username,
          recipeId: foundRecipe.id,
        })
      );
    } catch (err) {
      alert("Something went wrong ! Please try again");
      console.error(err);
    }
  };

  ////////////////EDIT RECIPE HANDLERS//////////////
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
        (recipe) => recipe.id === +recipeId
      );

      foundCopyRecipe.name = editRecipeName.current.value;
      foundCopyRecipe.servings = editRecipeServings.current.value;
      foundCopyRecipe.time = editRecipeTime.current.value;
      foundCopyRecipe.difficulty = editRecipeDifficulty.current.value;
      foundCopyRecipe.url = editRecipeImgURL.current.value;
      foundCopyRecipe.ingredients = ingredientsArray;

      const payload = {
        username: foundUser.username,
        recipesId: foundUser.recipesId + 1,
        foodId: foundUser.foodId,
        totalQuantity: foundUser.totalQuantity,
        totalWeight: foundUser.totalWeight,
        recipes: recipesCopy,
        food: foundUser.food,
      };
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
      }

      await setDoc(docRef, payload);

      dispatch(
        fridgeActions.editRecipe({
          username: foundUser.username,
          ...foundCopyRecipe
        })
      );

      setShowEditRecipeModal(false);
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
        <h4>format: amount, name (i.e: 5g, salt) </h4>
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

  // const editIngredientsModal = (
  //   <form
  //     className={modalClasses.main}
  //     onSubmit={submitEditIngredientsHandler}
  //     key={ingredientsInputAmount}
  //   >
  //     {[...Array(ingredientsInputAmount)].map((recipe, i) => {
  //       return (
  //         <div key={i}>
  //           <label>Ingredient {i + 1}</label>
  //           <input
  //             type="text"
  //             ref={ingredientRefs[i]}
  //             maxLength={RECIPEINGREDIENTS_MAX_LENGTH}
  //             defaultValue={recipeIngredients[i]}
  //           />
  //         </div>
  //       );
  //     })}

  //     {ingredientsInputAmount !== RECIPEINGREDIENTS_MAX_AMOUNT_OF_INPUTS && (
  //       <button type="button" value="+" onClick={ingredientsInputAmountHandler}>
  //         +
  //       </button>
  //     )}
  //     {ingredientsInputAmount !== 1 && (
  //       <button type="button" value="-" onClick={ingredientsInputAmountHandler}>
  //         -
  //       </button>
  //     )}
  //     <button>Confirm</button>
  //   </form>
  // );

  return (
    mounted && (
      <div className={classes.background}>
        <div className={classes.temporary}>
          <div className={classes.container}>
            <div className={classes.fill}>
              <img src={foundRecipe.url} alt="Recipe Detail Image" />
            </div>
            <div className={classes.short_desc}>
              <h1>{foundRecipe.name}</h1>
              <ul>
                {foundRecipe.ingredients.map((ing) => {
                  return <li key={Math.random()}>✔ {ing}</li>;
                })}
              </ul>
              <div className={classes.short_desc_btn}>
                <button
                  onClick={() => {
                    setShowEditRecipeModal(true);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
          {!showDescriptionInput && !showDescription && (
            <div className={classes.add_desc}>
              <button onClick={() => setShowDescriptionInput(true)}>
                Add Description
              </button>
            </div>
          )}
          {showDescriptionInput && !showDescription && (
            <Fragment>
              <div
                className={classes.long_desc_input}
                key={recipeDescription ? recipeDescription : ""}
              >
                <textarea
                  type="text"
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
          )}
          {!showDescriptionInput && showDescription && (
            <Fragment>
              <div className={classes.long_desc_text}>
                <text>{foundRecipe.description}</text>
              </div>
              <div className={classes.long_desc_text_btn}>
                <button onClick={editDescriptionHandler}>Edit</button>
                <button onClick={removeDescriptionHandler}>Remove</button>
              </div>
            </Fragment>
          )}
        </div>
        <Modal
          open={showEditRecipeModal}
          onClose={() => {
            setShowEditRecipeModal(false);
          }}
        >
          <Fade in={showEditRecipeModal}>{editRecipeModal}</Fade>
        </Modal>
      </div>
    )
  );
}

export default withAuth(RecipeDetails);
