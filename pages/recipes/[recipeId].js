import { useRouter } from "next/router";
import withAuth from "../../components/control/withAuth";
import { useState, useEffect, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import classes from "./recipeDetails.module.css";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../components/control/initFirebase";
import { RECIPEDESCRIPTION_MAX_LENGTH } from "../../components/control/config";
import Ingredient from "./Ingredient";
import { AddtoListIcon } from "../../components/utils/icons";
import EditRecipeModal from "../../components/modals/recipes/EditRecipeModal";
import RemoveRecipeModal from "../../components/modals/recipes/RemoveRecipeModal";

function RecipeDetails() {
  const [mounted, setMounted] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showEditRecipeModal, setShowEditRecipeModal] = useState(false);
  const [showRemoveRecipeModal, setShowRemoveRecipeModal] = useState(false);
  const router = useRouter();
  const addDescription = useRef();
  const dispatch = useDispatch();
  const recipeId = router.query.recipeId;
  const users = useSelector((state) => state.users);
  const foundUser = users.find((user) => user.id !== "");
  const foundRecipe = foundUser?.recipes.find(
    (recipe) => recipe.id === +recipeId
  );
  const recipeDescription = foundRecipe?.description;

  useEffect(() => {
    if (recipeDescription) {
      setShowDescription(true);
    }

    setMounted(true);
  }, [recipeDescription]);

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

  const addDescriptionHandler = async (e) => {
    try {
      e.preventDefault();

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

  ////////////////RECIPE HANDLERS//////////////

  return (
    mounted && (
      <div className={classes.background}>
        <div className={classes.temporary}>
          <div className={classes.container}>
            <div className={classes.fill} key={foundRecipe.id}>
              <img
                src={foundRecipe.url ? foundRecipe.url : "/altrecipeimg.jpg"}
                alt="Recipe Details Image"
              />
            </div>
            <div className={classes.short_desc}>
              <div className={classes.name_container}>
                <div className={classes.name}>
                  <h1>{foundRecipe.name}</h1>
                </div>
                <div className={classes.add_to_list}>
                  <AddtoListIcon />
                </div>
              </div>
              <ul className={classes.ingredient_list}>
                {foundRecipe.ingredients.map((ing) => {
                  return (
                    <Ingredient
                      key={Math.random()}
                      ing={ing}
                      recipeId={recipeId}
                    />
                  );
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
                <button
                  onClick={() => {
                    setShowRemoveRecipeModal(true);
                  }}
                >
                  Remove
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
                  maxLength={RECIPEDESCRIPTION_MAX_LENGTH}
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
        <EditRecipeModal
          showEditRecipeModal={showEditRecipeModal}
          setShowEditRecipeModal={setShowEditRecipeModal}
          recipeId={recipeId}
        />
        <RemoveRecipeModal
          showRemoveRecipeModal={showRemoveRecipeModal}
          setShowRemoveRecipeModal={setShowRemoveRecipeModal}
          recipeId={recipeId}
        />
      </div>
    )
  );
}

export default withAuth(RecipeDetails);
