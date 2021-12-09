import classes from "./ImgAndIngredients.module.css";
import Ingredient from "./Ingredient";
import { AddtoListIcon } from "../../components/utils/icons";
import { findRecipe } from "../../components/utils/helpers";
import { useRouter } from "next/router";

function ImgAndIngredients(props) {
  const router = useRouter();
  const recipeId = router.query.recipeId;
  const foundRecipe = findRecipe(recipeId);

  return (
    <div className={classes.container}>
      <div className={classes.fill_img} key={foundRecipe.id}>
        <img
          src={foundRecipe.url ? foundRecipe.url : "/altrecipeimg.jpg"}
          alt="Recipe Details Image"
        />
      </div>
      <div className={classes.ing_name_container}>
        <div className={classes.name_container}>
          <div className={classes.name}>
            <h1>{foundRecipe.name}</h1>
          </div>
          <div className={classes.add_to_shoppinglist}>
            <AddtoListIcon />
          </div>
        </div>
        <ul className={classes.ingredients}>
          {foundRecipe.ingredients.map((ing) => {
            return <Ingredient key={Math.random()} ing={ing} />;
          })}
        </ul>
        <div className={classes.ingredients_btn}>
          <button
            onClick={() => {
              props.setShowEditRecipeModal(true);
            }}
          >
            Edit
          </button>
          <button
            onClick={() => {
              props.setShowRemoveRecipeModal(true);
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImgAndIngredients;
