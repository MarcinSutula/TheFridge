import { useDispatch } from "react-redux";
import { fridgeActions } from "../../../store/index";
import { useRouter } from "next/router";
import modalClasses from "../../../styles/modalClasses.module.css";
import { Modal, Fade } from "@material-ui/core";
import Spinner from "../../utils/Spinner";
import { AuthURL, fetchFirestoreData } from "../../control/initFirebase";
import { useState, Fragment } from "react";
import {
  ALERT_AUTH_FAIL,
  ALERT_EMAIL_NOTFOUND,
  ALERT_INVALID_PASSWORD,
  ALERT_USER_DISABLED,
} from "../../control/config";
import { useForm } from "react-hook-form";

function SignInModal(props) {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const signInModalOnCloseHandler = () => {
    props.setShowSignInModal(false);
    reset();
  };

  const signInHandler = async (data) => {
    setIsLoading(true);

    fetch(AuthURL("signInWithPassword"), {
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
            const userData = await fetchFirestoreData(resData.localId, "get");
            localStorage.setItem("userId", resData.localId);
            props.setStorageUserId(resData.localId);

            dispatch(
              fridgeActions.login({
                username: data.username,
                id: resData.localId,
                foodId: userData.foodId,
                totalQuantity: userData.totalQuantity,
                totalWeight: userData.totalWeight,
                food: userData.food,
                recipes: userData.recipes,
              })
            );

            setIsLoading(false);
            props.setShowSignInModal(false);
            reset();
            router.push("/food");
          } catch (err) {
            alert(ALERT_AUTH_FAIL);
            console.error(err);
          }
        });
      } else {
        return res.json().then((resData) => {
          setIsLoading(false);
          switch (resData.error.message) {
            case "EMAIL_NOT_FOUND":
              alert(ALERT_EMAIL_NOTFOUND);
              break;
            case "INVALID_PASSWORD":
              alert(ALERT_INVALID_PASSWORD);
              break;
            case "USER_DISABLED":
              alert(ALERT_USER_DISABLED);
              break;
            default:
              alert(ALERT_AUTH_FAIL);
              break;
          }
        });
      }
    });
  };

  const signInModal = (
    <form onSubmit={handleSubmit(signInHandler)} className={modalClasses.main}>
      <div>
        <label>E-mail</label>
        <input type="email" {...register("username")} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register("password")} />
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
