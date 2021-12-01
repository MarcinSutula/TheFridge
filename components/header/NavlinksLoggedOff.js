import classes from "./NavlinksLoggedOff.module.css";

function NavlinksLoggedOff(props) {
  return (
    <div className={classes.navigation}>
      <button
        className={classes.signin}
        onClick={() => props.setShowSignInModal(true)}
      >
        Sign In
      </button>
      <button
        className={classes.signup}
        onClick={() => props.setShowSignUpModal(true)}
      >
        Sign Up
      </button>
    </div>
  );
}

export default NavlinksLoggedOff;
