import { Fragment, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import { useRouter } from "next/router";
import classes from "./Header.module.css";
import Logo from "./Logo";
import WelcomeUser from "./WelcomeUser";
import NavlinksLoggedOff from "./NavlinksLoggedOff";
import NavlinksLoggedIn from "./NavlinksLoggedIn";
import SignInModal from "../modals/header/SignInModal";
import SignUpModal from "../modals/header/SignUpModal";
import { FindUser } from "../utils/helpers";

function Header() {
  const [mounted, setMounted] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const foundUser = FindUser();
  const userId = foundUser?.id;

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoutHandler = () => {
    dispatch(fridgeActions.logout());
    localStorage.removeItem("userId");
    router.replace("/");
  };

  const forwardToSignUpHandler = () => {
    setShowSignInModal(false);
    setShowSignUpModal(true);
  };

  return (
    <Fragment>
      <header className={classes.header}>
        <Logo />
        {userId && mounted && <WelcomeUser foundUser={foundUser} />}
        {!userId && mounted && (
          <NavlinksLoggedOff
            setShowSignInModal={setShowSignInModal}
            setShowSignUpModal={setShowSignUpModal}
          />
        )}
        {userId && mounted && (
          <NavlinksLoggedIn logoutHandler={logoutHandler} />
        )}
      </header>
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
        forwardToSignUpHandler={forwardToSignUpHandler}
      />
      <SignUpModal
        showSignUpModal={showSignUpModal}
        setShowSignUpModal={setShowSignUpModal}
      />
    </Fragment>
  );
}

export default Header;
