import classes from "./BodyFridgeDescription.module.css";
import { checkIcon } from "../components/utils/icons";
//TO REWRITE
function BodyFridgeDescription() {
  return (
    <div id="fridge_desc" className={classes.container}>
      <h1>Food description</h1>
      {/* <div>
        <ul className={classes.description_list}>
          <li>
            {checkIcon}
            <p>Add food</p>
          </li>
          <li>
            {checkIcon} <p>Edit food</p>
          </li>
          <li>
            {checkIcon}
            <p>Sort by columns</p>
          </li>
          <li>
            {checkIcon} <p>Check for expiration</p>
          </li>
          <li>
            {checkIcon}
            <p>Add to shopping list</p>
          </li>
          <li>
            {checkIcon}
            <p>See the summary</p>
          </li>
        </ul>
      </div> */}
      {/* <div className={classes.img_container}>
        <img src="tablepage5.jpg" alt="An example of fridge in table" />
      </div> */}
    </div>
  );
}

export default BodyFridgeDescription;
