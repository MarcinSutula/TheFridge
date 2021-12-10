import classes from "./NavlinksLoggedOff.module.css";

function NavlinksLoggedOff(props) {
  const signInBtnHandler = () => {
    props.setShowSignInModal(true);
  };

  const signUpBtnHandler = () => {
    props.setShowSignUpModal(true);
  };

  return (
    <div className={classes.navigation}>
      <button className={classes.signin} onClick={signInBtnHandler}>
        Sign In
      </button>
      <button className={classes.signup} onClick={signUpBtnHandler}>
        Sign Up
      </button>
    </div>
  );
}

export default NavlinksLoggedOff;
