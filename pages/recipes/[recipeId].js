import { useRouter } from "next/router";
import withAuth from "../../components/control/withAuth";
import { useState, useEffect, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import classes from "./recipeDetails.module.css";

function RecipeDetails() {
  const [mounted, setMounted] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [showDescriptionText, setShowDescriptionText] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const addDescription = useRef();
  const recipeId = router.query.recipeId;
  const users = useSelector((state) => state.users);
  const foundUser = users.find((user) => user.id !== null);
  const foundRecipe = foundUser?.recipes.find(
    (recipe) => recipe.id === +recipeId
  );
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const addDescriptionHandler = () => {
    if (!addDescription.current.value) {
      alert("Description cannot be empty");
      return;
    }

    setShowDescriptionInput(false);
    dispatch(
      fridgeActions.addDescription({
        username: foundUser.username,
        recipeId: foundRecipe.id,
        description: addDescription.current.value,
      })
    );

    setShowDescriptionText(true);
  };
  const removeDescriptionHandler = () => {
    setShowDescriptionText(false);
    dispatch(
      fridgeActions.removeDescription({
        username: foundUser.username,
        recipeId: foundRecipe.id,
      })
    );
  };

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
                <button>Edit</button>
                <button>Remove</button>
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
              <div className={classes.long_desc_input}>
                <textarea type="text" ref={addDescription} autoFocus={true} />
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
                <button>Edit</button>
                <button onClick={removeDescriptionHandler}>Remove</button>
              </div>
            </Fragment>
          )}
        </div>
        
      </div>
    )
  );
}

export default withAuth(RecipeDetails);
