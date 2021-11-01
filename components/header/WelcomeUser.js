import classes from "./WelcomeUser.module.css";
import { welcomeName } from "../utils/helpers";

function WelcomeUser(props) {
  return (
    <h2 className={classes.welcome}>
      {welcomeName(props.foundUser?.username)}
    </h2>
  );
}

export default WelcomeUser;
