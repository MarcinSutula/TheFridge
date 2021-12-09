import classes from "./NoSuchRecipe.module.css";

function NoSuchRecipe() {
  return (
    <div className={classes.background}>
      <div className={classes.temporary}>
        <p>No such Recipe</p>
      </div>
    </div>
  );
}

export default NoSuchRecipe;
