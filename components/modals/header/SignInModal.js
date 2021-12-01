import { useDispatch } from "react-redux";
import { fridgeActions } from "../../../store/index";
import { useRouter } from "next/router";
import modalClasses from "../../../styles/modalClasses.module.css";
import { Modal, Fade } from "@material-ui/core";
import Spinner from "../../utils/Spinner";
import { AuthURL, db } from "../../control/initFirebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useRef, Fragment } from "react";

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
            alert("Authentication failed ! Please try again");
            console.error(err);
          }
        });
      } else {
        return res.json().then((data) => {
          setIsLoading(false);
          if (data.error.message === "EMAIL_NOT_FOUND") {
            signInInputUsername.current.focus();
            alert("E-mail not found");
          } else if (data.error.message === "INVALID_PASSWORD") {
            signInInputPassword.current.focus();
            alert("Invalid password");
          } else if (data.error.message === "USER_DISABLED") {
            signInInputUsername.current.focus();
            alert("This user has been disabled");
          } else {
            signInInputUsername.current.focus();
            alert("Authentication failed");
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
