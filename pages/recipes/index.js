import withAuth from "../../components/control/withAuth";
import classes from "./recipes.module.css";
import { useState, useEffect, Fragment } from "react";
import RecipeLabel from "../../components/recipes/RecipeLabel";
import Spinner from "../../components/utils/Spinner";
import AddRecipeModal from "../../components/modals/recipes/AddRecipeModal";
import { FindUser } from "../../components/utils/helpers";

function Recipes() {
  const [mounted, setMounted] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const foundUser = FindUser();
  let recipes;

  useEffect(() => {
    setMounted(true);
  }, []);

  const addRecipeBtnHandler = () => {
    setShowAddRecipeModal(true);
  };

  if (foundUser) {
    recipes = foundUser.recipes;
    if (!mounted) return <Spinner big={true} />;
  } else {
    recipes = [];
    return <Spinner big={true} />;
  }

  return (
    mounted && (
      <div className={classes.background}>
        <div className={classes.container}>
          <div className={classes.grid_container}>
            {recipes.map((recipe) => {
              return (
                <Fragment key={recipe.id}>
                  <RecipeLabel recipe={recipe} />
                </Fragment>
              );
            })}
            <button onClick={addRecipeBtnHandler}>Add Recipe</button>
          </div>
        </div>
        <AddRecipeModal
          showAddRecipeModal={showAddRecipeModal}
          setShowAddRecipeModal={setShowAddRecipeModal}
        />
      </div>
    )
  );
}

export default withAuth(Recipes);
