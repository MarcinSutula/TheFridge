import { AuthURL, db } from "../control/initFirebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Fragment, useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import { useRouter } from "next/router";
import modalClasses from "../../styles/modalClasses.module.css";
import classes from "./Header.module.css";
import { Modal, Fade } from "@material-ui/core";
import Spinner from "../utils/Spinner";
import { SIGNUP_TIMEOUT_TIME } from "../control/config";
import Logo from "./Logo";
import WelcomeUser from "./WelcomeUser";
import NavlinksLoggedOff from "./NavlinksLoggedOff";
import NavlinksLoggedIn from "./NavlinksLoggedIn";

function Header() {
  const [mounted, setMounted] = useState(false);
  const [storageUserId, setStorageUserId] = useState(null);
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const signupInputUsername = useRef();
  const signupInputPassword = useRef();
  const signinInputUsername = useRef();
  const signinInputPassword = useRef();
  const router = useRouter();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const foundUser = users.find((user) => user.id !== null);

  ///PRECHECK & RENDER (trouble connecting with withAuth)
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
            totalQuantity: getUser.totalQuantity,
            totalWeight: getUser.totalWeight,
            food: getUser.food,
          })
        );
      }
    } catch (err) {
      alert("Something went wrong ! Please try again");
      console.error(err);
    }
    setMounted(true);
  }, [storageUserId, dispatch]);

  ///NAVIGATION  HANDLERS
  const signupHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const payload = {
      username: signupInputUsername.current.value,
      password: signupInputPassword.current.value,
      foodId: 0,
      totalQuantity: 0,
      totalWeight: 0,
      food: [],
    };

    fetch(AuthURL("signUp"), {
      method: "POST",
      body: JSON.stringify({
        email: signupInputUsername.current.value,
        password: signupInputPassword.current.value,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (res.ok) {
        return res.json().then(async (data) => {
          try {
            const docRef = doc(db, "users", data.localId);
            await setDoc(docRef, payload);

            dispatch(
              fridgeActions.createUser({
                username: signupInputUsername.current.value,
              })
            );

            setIsLoading(false);
            setShowSuccessMsg(true);
            setTimeout(() => {
              signupInputUsername.current.value = "";
              signupInputPassword.current.value = "";
              signupInputUsername.current.focus();
              setShowSignupModal(false);
              setShowSuccessMsg(false);
            }, SIGNUP_TIMEOUT_TIME);
          } catch (err) {
            alert("Authentication failed ! Please try again");
            console.error(err);
          }
        });
      } else {
        return res.json().then((data) => {
          setIsLoading(false);
          if (data.error.message === "EMAIL_EXISTS") {
            signupInputUsername.current.focus();
            alert(
              "This e-mail has already been registered. Please choose another one"
            );
          } else if (data.error.message.includes("WEAK_PASSWORD")) {
            signupInputPassword.current.focus();
            alert("Password must contain at least 6 characters");
          } else if (data.error.message === "INVALID_EMAIL") {
            signupInputUsername.current.focus();
            alert("Invalid e-mail");
          } else {
            signupInputUsername.current.focus();
            alert("Authentication failed");
          }
        });
      }
    });
  };

  const signinHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    fetch(AuthURL("signInWithPassword"), {
      method: "POST",
      body: JSON.stringify({
        email: signinInputUsername.current.value,
        password: signinInputPassword.current.value,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (res.ok) {
        return res.json().then(async (data) => {
          try {
            const docRef = doc(db, "users", data.localId);
            const docSnap = await getDoc(docRef);
            const foundUser = docSnap.data();
            localStorage.setItem("userId", data.localId);
            setStorageUserId(data.localId);

            dispatch(
              fridgeActions.login({
                username: signinInputUsername.current.value,
                id: data.localId,
                foodId: foundUser.foodId,
                totalQuantity: foundUser.totalQuantity,
                totalWeight: foundUser.totalWeight,
                food: foundUser.food,
              })
            );

            setIsLoading(false);
            signinInputUsername.current.value = "";
            signinInputPassword.current.value = "";

            setShowSigninModal(false);

            router.push("/food");
          } catch (err) {
            alert("Authentication failed ! Please try again");
            console.error(err);
          }
        });
      } else {
        return res.json().then((data) => {
          setIsLoading(false);
          if (data.error.message === "EMAIL_NOT_FOUND") {
            signinInputUsername.current.focus();
            alert("E-mail not found");
          } else if (data.error.message === "INVALID_PASSWORD") {
            signinInputPassword.current.focus();
            alert("Invalid password");
          } else if (data.error.message === "USER_DISABLED") {
            signinInputUsername.current.focus();
            alert("This user has been disabled");
          } else {
            signinInputUsername.current.focus();
            alert("Authentication failed");
          }
        });
      }
    });
  };

  const logoutHandler = () => {
    dispatch(fridgeActions.logout());
    localStorage.removeItem("userId");
    setStorageUserId(null);
    router.replace("/");
  };

  const forwardToSignupHandler = () => {
    setShowSigninModal(false);
    setShowSignupModal(true);
  };
  ///MODALS (DO NOT CREATE THEM AS ANOTHER COMPONENT)
  const signinModal = (
    <form onSubmit={signinHandler} className={modalClasses.main}>
      <div>
        <label>E-mail</label>
        <input type="email" ref={signinInputUsername} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" ref={signinInputPassword} />
      </div>
      {!isLoading && (
        <Fragment>
          <div className={modalClasses.btn_container}>
            <button>Login</button>
          </div>
          <div className={modalClasses.btn_container}>
            <h4>Don't have an account ?</h4>
            <a
              onClick={forwardToSignupHandler}
              className={modalClasses.signin_create_acc_btn}
            >
              Create one here!
            </a>
          </div>
        </Fragment>
      )}
      {isLoading && <Spinner />}
    </form>
  );

  const signupModal = (
    <form onSubmit={signupHandler} className={modalClasses.main}>
      <div>
        <label>E-mail </label>
        <input type="email" ref={signupInputUsername} />
      </div>
      <div>
        <label>Password </label>
        <input type="password" ref={signupInputPassword} />
      </div>
      {!isLoading && !showSuccessMsg && (
        <div className={modalClasses.btn_container}>
          <button>Create Account</button>
        </div>
      )}
      {isLoading && !showSuccessMsg && <Spinner />}
      {showSuccessMsg && !isLoading && <h4>✔ Account created successfully</h4>}
    </form>
  );

  return (
    <Fragment>
      <header className={classes.header}>
        <Logo />
        {storageUserId && mounted && <WelcomeUser foundUser={foundUser} />}
        {!storageUserId && mounted && (
          <NavlinksLoggedOff
            setShowSigninModal={setShowSigninModal}
            setShowSignupModal={setShowSignupModal}
          />
        )}
        {storageUserId && mounted && (
          <NavlinksLoggedIn logoutHandler={logoutHandler} />
        )}
      </header>
      <Modal
        disableScrollLock={true}
        open={showSigninModal}
        onClose={() => setShowSigninModal(false)}
      >
        <Fade in={showSigninModal}>{signinModal}</Fade>
      </Modal>
      <Modal
        disableScrollLock={true}
        open={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      >
        <Fade in={showSignupModal}>{signupModal}</Fade>
      </Modal>
    </Fragment>
  );
}

export default Header;
