import classes from "./ImgAndIngredients.module.css";
import Ingredient from "./Ingredient";
import { AddtoListIcon } from "../../components/utils/icons";
import { findRecipe } from "../../components/utils/helpers";
import { useRouter } from "next/router";

import { useState } from "react";
import AddIngsToShopListModal from "../../components/modals/recipes/AddIngsToShopListModal";

function ImgAndIngredients(props) {
  const router = useRouter();
  const recipeId = router.query.recipeId;
  const foundRecipe = findRecipe(recipeId);
  const [showIngToShopListModal, setShowIngToShopListModal] = useState(false);

  const editRecipeBtnHandler = () => {
    props.setShowEditRecipeModal(true);
  };

  const removeRecipeBtnHandler = () => {
    props.setShowRemoveRecipeModal(true);
  };

  const showAddIngsToShopListIconBtnHandler = () => {
    setShowIngToShopListModal(true);
  };

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
            <AddtoListIcon onClick={showAddIngsToShopListIconBtnHandler} />
          </div>
        </div>
        <ul className={classes.ingredients}>
          {foundRecipe.ingredients.map((ing, i) => {
            return <Ingredient key={Math.random() * i} ing={ing} />;
          })}
        </ul>
        <div className={classes.ingredients_btn}>
          <button onClick={editRecipeBtnHandler}>Edit</button>
          <button onClick={removeRecipeBtnHandler}>Remove</button>
        </div>
      </div>
      <AddIngsToShopListModal
        showIngToShopListModal={showIngToShopListModal}
        setShowIngToShopListModal={setShowIngToShopListModal}
        ingredients={foundRecipe.ingredients}
      />
    </div>
  );
}

export default ImgAndIngredients;
