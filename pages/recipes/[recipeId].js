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
  RECIPEINGREDIENTS_MAX_LENGTH,
  RECIPEINGREDIENTS_MAX_AMOUNT_OF_INPUTS,
} from "../../components/control/config";

function RecipeDetails() {
  const [mounted, setMounted] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [showDescriptionText, setShowDescriptionText] = useState(false);
  const [showEditIngredientsModal, setShowEditIngredientsModal] =
    useState(false);
  const [ingredientsInputAmount, setIngredientsInputAmount] = useState(1);
  const router = useRouter();
  const dispatch = useDispatch();
  const addDescription = useRef();
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
      setShowDescriptionText(true);
    }

    setMounted(true);
  }, []);

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

      if (!addDescription.current.value) {
        alert("Description cannot be empty");
        return;
      }
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

      setShowDescriptionInput(false);
      dispatch(
        fridgeActions.addDescription({
          username: foundUser.username,
          recipeId: foundRecipe.id,
          description: foundCopyRecipe.description,
        })
      );

      setShowDescriptionText(true);
    } catch (err) {
      alert("Something went wrong ! Please try again");
      console.error(err);
    }
  };
  const editDescriptionHandler = () => {
    setShowDescriptionInput(true);
    setShowDescriptionText(false);
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

      setShowDescriptionText(false);

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

  ////////////////INGREDIENTS HANDLERS//////////////
  const ingredientsInputAmountHandler = (e) => {
    e.preventDefault();

    setIngredientsInputAmount((prevState) => {
      return prevState + (e.target.value === "+" ? 1 : -1);
    });
  };

  const submitEditIngredientsHandler = (e) => {
    e.preventDefault();

    console.log("edit ingredients");
  };

  const editIngredientsModal = (
    <form
      className={modalClasses.main}
      onSubmit={submitEditIngredientsHandler}
      key={ingredientsInputAmount}
    >
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

      <button type="button" value="+" onClick={ingredientsInputAmountHandler}>
        +
      </button>
      <button type="button" value="-" onClick={ingredientsInputAmountHandler}>
        -
      </button>
      <button>Confirm</button>
    </form>
  );

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
                    setShowEditIngredientsModal(true);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
          {!showDescriptionInput && !showDescriptionText && (
            <div className={classes.add_desc}>
              <button onClick={() => setShowDescriptionInput(true)}>
                Add Description
              </button>
            </div>
          )}
          {showDescriptionInput && !showDescriptionText && (
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
                <button
                  type="button"
                  onClick={() => setShowDescriptionInput(false)}
                >
                  Cancel
                </button>
              </div>
            </Fragment>
          )}
          {!showDescriptionInput && showDescriptionText && (
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
          open={showEditIngredientsModal}
          onClose={() => {
            setShowEditIngredientsModal(false);
          }}
        >
          <Fade in={showEditIngredientsModal}>{editIngredientsModal}</Fade>
        </Modal>
      </div>
    )
  );
}

export default withAuth(RecipeDetails);
