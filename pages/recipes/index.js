import withAuth from "../../components/control/withAuth";
import classes from "./recipes.module.css";
import { useState, useEffect, Fragment } from "react";
import RecipeLabel from "./RecipeLabel";
import { useSelector } from "react-redux";
import Spinner from "../../components/utils/Spinner";
import AddRecipeModal from "../../components/modals/recipes/AddRecipeModal";

function Recipes() {
  const [mounted, setMounted] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const users = useSelector((state) => state.users);
  const foundUser = users.find((user) => user.id !== "");

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
        <AddRecipeModal
          showAddRecipeModal={showAddRecipeModal}
          setShowAddRecipeModal={setShowAddRecipeModal}
        />
      </div>
    )
  );
}

export default withAuth(Recipes);
