import classes from "./RecipeLabel.module.css";
import { useRouter } from "next/router";
import altphoto from "../../public/altrecipeimg.jpg";

function RecipeLabel(props) {
  const router = useRouter();

  const recipeOnClickHandler = () => {
    router.push(`/recipes/${props.recipe.id}`);
  };

  return (
    <div
      key={props.recipe.id}
      className={classes.grid_element}
      onClick={recipeOnClickHandler}
    >
      <div className={classes.fill_img} key={props.recipe.id}>
        <img
          src={props.recipe.url ? props.recipe.url : "/altrecipeimg.jpg"}
          alt="Recipe Image"
        />
      </div>
      <div className={classes.desc_short}>
        <h1>{props.recipe.name}</h1>
        <ul>
          <li>🍴 &nbsp; {props.recipe.servings} </li>
          <li>⏰ {props.recipe.time} min</li>
          <li>👌 &nbsp; {props.recipe.difficulty}</li>
        </ul>
      </div>
    </div>
  );
}

export default RecipeLabel;
