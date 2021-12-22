import classes from "./BodyRecipesDescription.module.css";
import { checkIcon } from "../utils/icons";
import Image from "next/image";

function BodyRecipesDescription() {
  return (
    <div id="recipes_desc" className={classes.container}>
      <div className={classes.img_container}>
        <Image
          className={classes.next_img}
          src="/recipiesprintscreen.JPG"
          alt="An example of fridge in table"
          layout="fill"
          priority="true"
        />
      </div>
      <div className={classes.description_list}>
        <h1>Recipes</h1>
        <ul>
          <li>
            {checkIcon}
            <p>Add & Edit recipes</p>
          </li>

          <li>
            {checkIcon}
            <p>See if you already have the ingredient</p>
          </li>
          <li>
            {checkIcon} <p>Pass missing ingredients to shopping list</p>
          </li>
          <li>
            {checkIcon}
            <p>Add & Edit description </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default BodyRecipesDescription;
