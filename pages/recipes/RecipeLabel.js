import classes from "./recipes.module.css";
import { useRouter } from "next/router";
import altphoto from "../../public/altrecipeimg.jpg";

function RecipeLabel(props) {
  const router = useRouter();

  return (
    <div
      key={props.recipe.id}
      className={classes.grid_element}
      onClick={() => {
        router.push(`/recipes/${props.recipe.id}`);
      }}
    >
      <div className={classes.fill} key={props.recipe.id}>
        <img
          src={props.recipe.url ? props.recipe.url : "/altrecipeimg.jpg"}
          alt="Recipe Image"
        />
      </div>
      <div className={classes.short_desc}>
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
