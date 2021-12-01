import { useDispatch } from "react-redux";
import { fridgeActions } from "../../../store/index";
import modalClasses from "../../../styles/modalClasses.module.css";
import { Modal, Fade } from "@material-ui/core";
import Spinner from "../../utils/Spinner";
import { AuthURL, db } from "../../control/initFirebase";
import { doc, setDoc } from "firebase/firestore";
import { useState, useRef } from "react";
import {SIGNUP_TIMEOUT_TIME} from '../../control/config'

function SignUpModal(props) {
  
  const dispatch = useDispatch();
  const signUpInputUsername = useRef();
  const signUpInputPassword = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const signUpHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const payload = {
      username: signUpInputUsername.current.value,
      foodId: 0,
      totalQuantity: 0,
      totalWeight: 0,
      food: [],
      recipes: [],
    };

    fetch(AuthURL("signUp"), {
      method: "POST",
      body: JSON.stringify({
        email: signUpInputUsername.current.value,
        password: signUpInputPassword.current.value,
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
                username: signUpInputUsername.current.value,
              })
            );

            setIsLoading(false);
            setShowSuccessMsg(true);
            setTimeout(() => {
              signUpInputUsername.current.value = "";
              signUpInputPassword.current.value = "";
              signUpInputUsername.current.focus();
              props.setShowSignUpModal(false);
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
            signUpInputUsername.current.focus();
            alert(
              "This e-mail has already been registered. Please choose another one"
            );
          } else if (data.error.message.includes("WEAK_PASSWORD")) {
            signUpInputPassword.current.focus();
            alert("Password must contain at least 6 characters");
          } else if (data.error.message === "INVALID_EMAIL") {
            signUpInputUsername.current.focus();
            alert("Invalid e-mail");
          } else {
            signUpInputUsername.current.focus();
            alert("Authentication failed");
          }
        });
      }
    });
  };

  const signUpModal = (
    <form onSubmit={signUpHandler} className={modalClasses.main}>
      <div>
        <label>E-mail </label>
        <input type="email" ref={signUpInputUsername} />
      </div>
      <div>
        <label>Password </label>
        <input type="password" ref={signUpInputPassword} />
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
    <Modal
      disableScrollLock={true}
      open={props.showSignUpModal}
      onClose={() => props.setShowSignUpModal(false)}
    >
      <Fade in={props.showSignUpModal}>{signUpModal}</Fade>
    </Modal>
  );
}

export default SignUpModal;
