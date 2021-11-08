import { useRouter } from "next/router";
import withAuth from "../../components/control/withAuth";
import { useState } from "react";

import classes from "./recipeDetails.module.css";

function RecipeDetails() {
  const router = useRouter();
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

  const recipeId = router.query.recipeId;
  const foundRecipe = recipes.find((recipe) => {
    return recipe.id === +recipeId;
  });

  if (!foundRecipe)
    return (
      <div className={classes.background}>
        <div className={classes.temporary}>
          <p>No such Recipe</p>
        </div>
      </div>
    );

  return (
    <div className={classes.background}>
      <div className={classes.temporary}>
        <h1>{foundRecipe.name}</h1>
        <p>{foundRecipe.servings}</p>
        <p>{foundRecipe.time}</p>
        <p>{foundRecipe.difficulty}</p>
        <p>{foundRecipe.ingredients}</p>
      </div>
    </div>
  );
}

export default withAuth(RecipeDetails);
