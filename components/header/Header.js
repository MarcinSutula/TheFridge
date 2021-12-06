import { fetchFirestoreData } from "../control/initFirebase";
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
import { findUser } from "../utils/helpers";
import { ALERT_OTHER } from "../control/config";

function Header() {
  const [mounted, setMounted] = useState(false);
  const [storageUserId, setStorageUserId] = useState();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const foundUser = findUser();

  useEffect(async () => {
    try {
      const userId = localStorage.getItem("userId");
      setStorageUserId(userId);

      if (userId) {
        const userData = await fetchFirestoreData(userId, "get");
        if (!userData) return;

        dispatch(
          fridgeActions.login({
            username: userData.username,
            id: userId,
            foodId: userData.foodId,
            recipesId: userData.recipesId,
            totalQuantity: userData.totalQuantity,
            totalWeight: userData.totalWeight,
            food: userData.food,
            recipes: userData.recipes,
          })
        );
      }
    } catch (err) {
      alert(ALERT_OTHER);
      console.error(err);
    }
    setMounted(true);
  }, [storageUserId, dispatch]);

  const logoutHandler = () => {
    dispatch(fridgeActions.logout());
    localStorage.removeItem("userId");
    setStorageUserId("");
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
        {storageUserId && mounted && <WelcomeUser foundUser={foundUser} />}
        {!storageUserId && mounted && (
          <NavlinksLoggedOff
            setShowSignInModal={setShowSignInModal}
            setShowSignUpModal={setShowSignUpModal}
          />
        )}
        {storageUserId && mounted && (
          <NavlinksLoggedIn logoutHandler={logoutHandler} />
        )}
      </header>
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
        forwardToSignUpHandler={forwardToSignUpHandler}
        setStorageUserId={setStorageUserId}
      />
      <SignUpModal
        showSignUpModal={showSignUpModal}
        setShowSignUpModal={setShowSignUpModal}
      />
    </Fragment>
  );
}

export default Header;
