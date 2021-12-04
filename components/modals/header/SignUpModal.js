import { useDispatch } from "react-redux";
import { fridgeActions } from "../../../store/index";
import modalClasses from "../../../styles/modalClasses.module.css";
import { Modal, Fade } from "@material-ui/core";
import Spinner from "../../utils/Spinner";
import { AuthURL, db } from "../../control/initFirebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  ALERT_AUTH_FAIL,
  ALERT_EMAIL_EXISTS,
  ALERT_EMAIL_INVALID,
  ALERT_WEAK_PASSWORD,
  SIGNUP_TIMEOUT_TIME,
} from "../../control/config";
import { useForm } from "react-hook-form";

function SignUpModal(props) {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const signUpModalOnCloseHandler = () => {
    props.setShowSignUpModal(false);
    reset();
  };

  const signUpHandler = async (data) => {
    setIsLoading(true);

    const payload = {
      username: data.username,
      foodId: 0,
      totalQuantity: 0,
      totalWeight: 0,
      food: [],
      recipes: [],
    };

    fetch(AuthURL("signUp"), {
      method: "POST",
      body: JSON.stringify({
        email: data.username,
        password: data.password,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (res.ok) {
        return res.json().then(async (resData) => {
          try {
            const docRef = doc(db, "users", resData.localId);
            await setDoc(docRef, payload);

            dispatch(
              fridgeActions.createUser({
                username: data.username,
              })
            );

            setIsLoading(false);
            setShowSuccessMsg(true);
            setTimeout(() => {
              props.setShowSignUpModal(false);
              setShowSuccessMsg(false);
              reset();
            }, SIGNUP_TIMEOUT_TIME);
          } catch (err) {
            alert(ALERT_AUTH_FAIL);
            console.error(err);
          }
        });
      } else {
        return res.json().then((resData) => {
          setIsLoading(false);
          switch (resData.error.message) {
            case "EMAIL_EXISTS":
              alert(ALERT_EMAIL_EXISTS);
              break;
            case "WEAK_PASSWORD : Password should be at least 6 characters":
              alert(ALERT_WEAK_PASSWORD);
              break;
            case "INVALID_EMAIL":
              alert(ALERT_EMAIL_INVALID);
              break;
            default:
              alert(ALERT_AUTH_FAIL);
              break;
          }
        });
      }
    });
  };

  const signUpModal = (
    <form onSubmit={handleSubmit(signUpHandler)} className={modalClasses.main}>
      <div>
        <label>E-mail </label>
        <input type="email" {...register("username")} />
      </div>
      <div>
        <label>Password </label>
        <input type="password" {...register("password")} />
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
      onClose={signUpModalOnCloseHandler}
    >
      <Fade in={props.showSignUpModal}>{signUpModal}</Fade>
    </Modal>
  );
}

export default SignUpModal;
