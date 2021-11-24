import withAuth from "../../components/control/withAuth";
import classes from "./recipes.module.css";
import modalClasses from "../../styles/modalClasses.module.css";
import { useState, useEffect, useRef, Fragment } from "react";
import RecipeLabel from "./RecipeLabel";
import { Modal, Fade } from "@material-ui/core";
import { maxLengthCheck } from "../../components/utils/helpers";
import {
  RECIPETIME_MAX_LENGTH,
  RECIPESERVINGS_MAX_LENGTH,
  RECIPENAME_MAX_LENGTH,
  RECIPEINGREDIENTS_MAX_LENGTH,
  RECIPEINGREDIENTS_MAX_AMOUNT_OF_INPUTS,
  RECIPEINGREDIENTS_REGEX
} from "../../components/control/config";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../components/control/initFirebase";
import { useSelector, useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import Spinner from "../../components/utils/Spinner";

function Recipes() {
  const [mounted, setMounted] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [ingredientsInputAmount, setIngredientsInputAmount] = useState(1);

  const addRecipeName = useRef();
  const addRecipeServings = useRef();
  const addRecipeTime = useRef();
  const addRecipeDifficulty = useRef();
  const addRecipeImgURL = useRef();
  const ingredientRefs = [...Array(RECIPEINGREDIENTS_MAX_AMOUNT_OF_INPUTS)].map(
    () => useRef()
  );
  const users = useSelector((state) => state.users);
  const foundUser = users.find((user) => user.id !== null);
  const dispatch = useDispatch();

  useEffect(() => {
    setMounted(true);
  }, []);

  let recipes;
  if (foundUser) {
    recipes = foundUser.recipes;
    if (!mounted) return <Spinner big={true} />;
  } else if (!foundUser) {
    recipes = [];
    return <Spinner big={true} />;
  }

  const submitAddRecipeHandler = async (e) => {
    try {
      e.preventDefault();
      const docRef = doc(db, "users", foundUser.id);
      const ingredientsArray = ingredientRefs
        .filter(
          (ref) =>
            ref?.current?.value !== undefined && ref?.current?.value !== ""
        )
        .map((ref) => ref.current.value);

      if (
        addRecipeName.current.value.trim().length < 1 ||
        +addRecipeServings.current.value < 1 ||
        +addRecipeTime.current.value < 0 ||
        addRecipeDifficulty.current.value === "DEFAULT" ||
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

      const recipeObj = {
        name: addRecipeName.current.value,
        servings: addRecipeServings.current.value,
        time: addRecipeTime.current.value,
        difficulty: addRecipeDifficulty.current.value,
        url: addRecipeImgURL.current.value,
        ingredients: ingredientsArray,
        id: foundUser.recipesId,
        description: "",
      };

      const payload = {
        username: foundUser.username,
        recipesId: foundUser.recipesId + 1,
        foodId: foundUser.foodId,
        totalQuantity: foundUser.totalQuantity,
        totalWeight: foundUser.totalWeight,
        recipes: [...foundUser.recipes, recipeObj],
        food: foundUser.food,
      };

      await setDoc(docRef, payload);

      dispatch(
        fridgeActions.addRecipe({ username: foundUser.username, ...recipeObj })
      );

      setShowAddRecipeModal(false);
      setIngredientsInputAmount(1);
    } catch (err) {
      alert("Something went wrong. Please try again !");
      console.error(err);
    }
  };

  const ingredientsInputAmountHandler = (e) => {
    e.preventDefault();
    setIngredientsInputAmount((prevState) => {
      return prevState + (e.target.value === "+" ? 1 : -1);
    });
  };

  const addRecipeModal = (
    <form className={modalClasses.main} onSubmit={submitAddRecipeHandler}>
      <div>
        <label>Name </label>
        <input
          type="text"
          ref={addRecipeName}
          autoFocus={true}
          maxLength={RECIPENAME_MAX_LENGTH}
          required
        />
      </div>
      <div>
        <label>Servings </label>
        <input
          type="number"
          ref={addRecipeServings}
          maxLength={RECIPESERVINGS_MAX_LENGTH}
          min="1"
          onInput={maxLengthCheck}
          required
        />
      </div>
      <div>
        <label>Time(min) </label>
        <input
          type="number"
          ref={addRecipeTime}
          maxLength={RECIPETIME_MAX_LENGTH}
          min="0"
          onInput={maxLengthCheck}
          required
        />
      </div>
      <div>
        <label>Difficulty </label>
        <select
          name="difficultylistAddRecipe"
          id="difficultylistAddRecipe"
          defaultValue={"DEFAULT"}
          ref={addRecipeDifficulty}
          required
        >
          <option value="DEFAULT" disabled hidden>
            Choose here
          </option>
          <option>easy</option>
          <option>medium</option>
          <option>hard</option>
        </select>
      </div>
      <div>
        <label>Image URL </label>
        <input type="url" ref={addRecipeImgURL} />
      </div>
      <div>
        <h2>Ingredients</h2>
        <h4>format: amount,name (i.e: 5g,salt) </h4>
      </div>
      {[...Array(ingredientsInputAmount)].map((ele, i) => {
        return (
          <div key={i}>
            <label>Ingredient {i + 1}</label>
            <input
              type="text"
              ref={ingredientRefs[i]}
              maxLength={RECIPEINGREDIENTS_MAX_LENGTH}
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
    mounted && (
      <div className={classes.background}>
        <div className={classes.temporary}>
          <div className={classes.grid_container}>
            {recipes.map((recipe) => {
              return (
                <Fragment key={recipe.id}>
                  <RecipeLabel recipe={recipe} />
                </Fragment>
              );
            })}
            <button onClick={() => setShowAddRecipeModal(true)}>
              Add Recipe
            </button>
          </div>
        </div>
        <Modal
          open={showAddRecipeModal}
          onClose={() => {
            setShowAddRecipeModal(false);
            setIngredientsInputAmount(1);
          }}
        >
          <Fade in={showAddRecipeModal}>{addRecipeModal}</Fade>
        </Modal>
      </div>
    )
  );
}

export default withAuth(Recipes);
