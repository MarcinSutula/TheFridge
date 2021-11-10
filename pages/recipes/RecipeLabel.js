import classes from "./recipes.module.css";
import { useRouter } from "next/router";
import altphoto from "../../public/altrecipeimg.jpg";

function RecipeLabel(props) {
  const router = useRouter();

  return (
    <div
      key={props.id}
      className={classes.grid_element}
      onClick={() => {
        router.push(`/recipes/${props.id}`);
      }}
    >
      <div className={classes.fill} key={props.id}>
        <img src={props.url ? props.url : "altrecipeimg.jpg"} alt="Recipe Image" />
      </div>

      <h2>{props.name}</h2>
    </div>
  );
}

export default RecipeLabel;
