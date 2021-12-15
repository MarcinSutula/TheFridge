import classes from "./BodyFridgeDescription.module.css";
import { checkIcon } from "../components/utils/icons";
import Image from "next/image";

function BodyFridgeDescription() {
  return (
    <div id="fridge_desc" className={classes.container}>
      <div className={classes.description_list}>
        <h1>Food</h1>
        <ul>
          <li>
            {checkIcon}
            <p>Add & Edit food</p>
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
          <li>
            {checkIcon} <p>Easily check the table while shopping</p>
          </li>
        </ul>
      </div>
      <div className={classes.img_container}>
        <Image
          className={classes.next_img}
          src="/foodtableprintscreen.jpg"
          alt="An example of fridge in table"
          layout="fill"
          priority="true"
        />
      </div>
    </div>
  );
}

export default BodyFridgeDescription;
