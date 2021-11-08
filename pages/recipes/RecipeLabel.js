import classes from "./recipes.module.css";
import { useRouter } from "next/router";

function RecipeLabel(props) {
  const router = useRouter();
  return (
    <div
      className={classes.grid_element}
      onClick={() => {
        router.push(`/recipes/${props.id}`);
      }}
    >
      <div className={classes.fill}>
        <img src={props.url} alt="Recipe photo" />
      </div>

      <h2>{props.name}</h2>
    </div>
  );
}

export default RecipeLabel;
