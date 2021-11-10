import { useRouter } from "next/router";
import withAuth from "../../components/control/withAuth";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import classes from "./recipeDetails.module.css";

function RecipeDetails() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
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

  return (
    mounted && (
      <div className={classes.background}>
        <div className={classes.temporary}>
          <h1>{foundRecipe.name}</h1>
          <p>{foundRecipe.servings}</p>
          <p>{foundRecipe.time}</p>
          <p>{foundRecipe.difficulty}</p>
          <p>{foundRecipe.ingredients}</p>
        </div>
      </div>
    )
  );
}

export default withAuth(RecipeDetails);
