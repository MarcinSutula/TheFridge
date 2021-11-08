import withAuth from "../../components/control/withAuth";
import classes from "./recipes.module.css";
import modalClasses from "../../styles/modalClasses.module.css";
import { useState, useEffect, useRef } from "react";
import RecipeLabel from "./RecipeLabel";
import { Modal, Fade } from "@material-ui/core";
import { maxLengthCheck } from "../../components/utils/helpers";
import {
  RECIPETIME_MAX_LENGTH,
  RECIPESERVINGS_MAX_LENGTH,
  RECIPENAME_MAX_LENGTH,
} from "../../components/control/config";
import { useRouter } from "next/router";

function Recipes() {
  const [mounted, setMounted] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [recipes, setRecipes] = useState([
    {
      name: "Carbonara",
      id: 1,
      servings: 1,
      time: "20 min",
      difficulty: "easy",
      url: "https://ocdn.eu/pulscms-transforms/1/iysk9kpTURBXy8xYTk4NGNlODc4OTlmOWFjNWVjNjgwZDYzYjI2MmJhYy5qcGeTlQMAH80D6M0CMpMJpjRkMDk1YQaTBc0EsM0CdoGhMAE/carbonara.jpg",
      ingredients: [
        "250g pasta",
        "150g bacon",
        "100g parmigiano reggiano",
        "salt",
        "pepper",
      ],
    },
    {
      name: "Lasagna Bolognese",
      id: 2,
      difficulty: "medium",
      time: "90 min",
      servings: 6,
      url: "https://wszystkoojedzeniu.pl/site/assets/files/105506/lasagna.650x0.jpeg",
      ingredients: [
        "250g pasta",
        "500g mashed meat",
        "1 carrot",
        "1 onion",
        "1 celery",
        "700 ml passata",
        "200ml red wine",
        "1.5l milk",
        "100g butter",
        "100g flour",
        "1 mozzarella",
        "100g parmigiano reggiano",
        "5g nutmeg",
        "salt",
        "pepper",
      ],
    },
    {
      name: "Spaghetti aglio e olio",
      id: 3,
      difficulty: "easy",
      time: "10 min",
      servings: 1,
      url: "https://italia-by-natalia.pl/wp-content/uploads/2020/11/spaghetti-aglio-olio-peperoncino-klasyczne.jpg",
      ingredients: [
        "250g pasta",
        "4 tb olive oil",
        "4 garlic cloves",
        "1 chili pepper",
        "parsley",
      ],
    },
  ]);
  const addRecipeName = useRef();
  const addRecipeServings = useRef();
  const addRecipeTime = useRef();
  const addRecipeDifficulty = useRef();
  const addRecipeImgURL = useRef();

  useEffect(() => {
    setMounted(true);
  }, []);

  const submitAddRecipeHandler = (e) => {
    e.preventDefault();

    setRecipes((prevState) => {
      return [
        ...prevState,
        {
          name: addRecipeName.current.value,
          servings: addRecipeServings.current.value,
          time: addRecipeTime.current.value,
          difficulty: addRecipeDifficulty.current.value,
          url: addRecipeImgURL.current.value,
        },
      ];
    });

    addRecipeName.current.value = "";
    addRecipeServings.current.value = "";
    addRecipeTime.current.value = "";
    addRecipeDifficulty.current.value = "";
    addRecipeImgURL.current.value = "";

    setShowAddRecipeModal(false);
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
        <input type="text" ref={addRecipeImgURL} />
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
                <RecipeLabel
                  id={recipe.id}
                  url={recipe.url}
                  name={recipe.name}
                  key={Math.random()}
                />
              );
            })}
          </div>
          <button onClick={() => setShowAddRecipeModal(true)}>
            Add Recipe
          </button>
        </div>
        <Modal
          open={showAddRecipeModal}
          onClose={() => setShowAddRecipeModal(false)}
        >
          <Fade in={showAddRecipeModal}>{addRecipeModal}</Fade>
        </Modal>
      </div>
    )
  );
}

export default withAuth(Recipes);
