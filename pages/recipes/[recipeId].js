import { useRouter } from "next/router";
import withAuth from "../../components/control/withAuth";
import { useState, useEffect } from "react";
import classes from "./recipeId.module.css";
import EditRecipeModal from "../../components/modals/recipes/EditRecipeModal";
import RemoveRecipeModal from "../../components/modals/recipes/RemoveRecipeModal";
import Description from "../../components/recipes/Description";
import { findRecipe } from "../../components/utils/helpers";
import DescriptionInput from "../../components/recipes/DescriptionInput";
import ImgAndIngredients from "../../components/recipes/ImgAndIngredients";
import NoSuchRecipe from "../../components/recipes/NoSuchRecipe";

function RecipeDetails() {
  const [mounted, setMounted] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showEditRecipeModal, setShowEditRecipeModal] = useState(false);
  const [showRemoveRecipeModal, setShowRemoveRecipeModal] = useState(false);
  const router = useRouter();
  const recipeId = router.query.recipeId;
  const foundRecipe = findRecipe(recipeId);
  const recipeDescription = foundRecipe?.description;

  useEffect(() => {
    if (recipeDescription) {
      setShowDescription(true);
    }

    if (!mounted) setMounted(true);
  }, [recipeDescription]);

  const addDescriptionBtnHandler = () => {
    setShowDescriptionInput(true);
  };

  if (!foundRecipe) return mounted && <NoSuchRecipe />;

  return (
    mounted && (
      <div className={classes.background}>
        <div className={classes.container}>
          <ImgAndIngredients
            setShowEditRecipeModal={setShowEditRecipeModal}
            setShowRemoveRecipeModal={setShowRemoveRecipeModal}
          />
          {!showDescriptionInput && !showDescription && (
            <div className={classes.add_desc_btn}>
              <button onClick={addDescriptionBtnHandler}>
                Add Description
              </button>
            </div>
          )}
          {showDescriptionInput && !showDescription && (
            <DescriptionInput
              setShowDescription={setShowDescription}
              setShowDescriptionInput={setShowDescriptionInput}
            />
          )}
          {!showDescriptionInput && showDescription && (
            <Description
              setShowDescription={setShowDescription}
              setShowDescriptionInput={setShowDescriptionInput}
            />
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
