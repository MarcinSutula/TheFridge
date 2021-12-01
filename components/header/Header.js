import { db } from "../control/initFirebase";
import { doc, getDoc } from "firebase/firestore";
import { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
      const getUserId = localStorage.getItem("userId");
      setStorageUserId(getUserId);

      if (getUserId) {
        const docRef = doc(db, "users", getUserId);
        const docSnap = await getDoc(docRef);
        const getUser = docSnap.data();

        if (!getUser || !docSnap) return;

        dispatch(
          fridgeActions.login({
            username: getUser.username,
            id: getUserId,
            foodId: getUser.foodId,
            recipesId: getUser.recipesId,
            totalQuantity: getUser.totalQuantity,
            totalWeight: getUser.totalWeight,
            food: getUser.food,
            recipes: getUser.recipes,
          })
        );
      }
    } catch (err) {
      alert("Something went wrong ! Please try again");
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
