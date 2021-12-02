import { useDispatch } from "react-redux";
import { fridgeActions } from "../../../store/index";
import { useRouter } from "next/router";
import modalClasses from "../../../styles/modalClasses.module.css";
import { Modal, Fade } from "@material-ui/core";
import Spinner from "../../utils/Spinner";
import { AuthURL, db } from "../../control/initFirebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useRef, Fragment } from "react";
import {
  ALERT_AUTH_FAIL,
  ALERT_EMAIL_NOTFOUND,
  ALERT_INVALID_PASSWORD,
  ALERT_USER_DISABLED,
} from "../../control/config";

function SignInModal(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const signInInputUsername = useRef();
  const signInInputPassword = useRef();

  const signInModalOnCloseHandler = () => {
    props.setShowSignInModal(false);
  };

  const signInHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    fetch(AuthURL("signInWithPassword"), {
      method: "POST",
      body: JSON.stringify({
        email: signInInputUsername.current.value,
        password: signInInputPassword.current.value,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (res.ok) {
        return res.json().then(async (data) => {
          try {
            const docRef = doc(db, "users", data.localId);
            const docSnap = await getDoc(docRef);
            const userData = docSnap.data();
            localStorage.setItem("userId", data.localId);
            props.setStorageUserId(data.localId);

            dispatch(
              fridgeActions.login({
                username: signInInputUsername.current.value,
                id: data.localId,
                foodId: userData.foodId,
                totalQuantity: userData.totalQuantity,
                totalWeight: userData.totalWeight,
                food: userData.food,
                recipes: userData.recipes,
              })
            );

            setIsLoading(false);
            signInInputUsername.current.value = "";
            signInInputPassword.current.value = "";

            props.setShowSignInModal(false);

            router.push("/food");
          } catch (err) {
            alert(ALERT_AUTH_FAIL);
            console.error(err);
          }
        });
      } else {
        return res.json().then((data) => {
          setIsLoading(false);
          switch (data.error.message) {
            case "EMAIL_NOT_FOUND":
              signInInputUsername.current.focus();
              alert(ALERT_EMAIL_NOTFOUND);
              break;
            case "INVALID_PASSWORD":
              signInInputPassword.current.focus();
              alert(ALERT_INVALID_PASSWORD);
              break;
            case "USER_DISABLED":
              signInInputUsername.current.focus();
              alert(ALERT_USER_DISABLED);
              break;
            default:
              signInInputUsername.current.focus();
              alert(ALERT_AUTH_FAIL);
              break;
          }
        });
      }
    });
  };

  const signInModal = (
    <form onSubmit={signInHandler} className={modalClasses.main}>
      <div>
        <label>E-mail</label>
        <input type="email" ref={signInInputUsername} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" ref={signInInputPassword} />
      </div>
      {!isLoading && (
        <Fragment>
          <div className={modalClasses.btn_container}>
            <button>Login</button>
          </div>
          <div className={modalClasses.btn_container}>
            <h4>Don't have an account ?</h4>
            <a
              onClick={props.forwardToSignUpHandler}
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

  return (
    <Modal
      disableScrollLock={true}
      open={props.showSignInModal}
      onClose={signInModalOnCloseHandler}
    >
      <Fade in={props.showSignInModal}>{signInModal}</Fade>
    </Modal>
  );
}

export default SignInModal;
