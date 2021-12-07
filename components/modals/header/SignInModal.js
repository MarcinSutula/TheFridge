import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import modalClasses from "../../../styles/modalClasses.module.css";
import { Modal, Fade } from "@material-ui/core";
import Spinner from "../../utils/Spinner";
import { useState, useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
import { signInThunk } from "../../../store/thunks/signInThunk";
import { findUser } from "../../utils/helpers";

function SignInModal(props) {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const signInStatus = useSelector((state) => state.signInStatus);

  useEffect(() => {
    if (signInStatus) {
      switch (signInStatus) {
        case "loading":
          setIsLoading(true);
          break;
        case "success":
          setIsLoading(false);
          props.setShowSignInModal(false);
          reset();
          router.push("/food");
          break;
        case "failed":
          setIsLoading(false);
          break;
      }
    }
  }, [signInStatus]);

  const signInModalOnCloseHandler = () => {
    props.setShowSignInModal(false);
    reset();
  };

  const signInHandler = async (data) => {
    dispatch(signInThunk(data));
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
