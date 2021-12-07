import { useDispatch, useSelector } from "react-redux";
import modalClasses from "../../../styles/modalClasses.module.css";
import { Modal, Fade } from "@material-ui/core";
import Spinner from "../../utils/Spinner";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { signUpThunk } from "../../../store/thunks/signUpThunk";
import { SIGNUP_TIMEOUT_TIME } from "../../control/config";

function SignUpModal(props) {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const signUpStatus = useSelector((state) => state.signUpStatus);

  useEffect(() => {
    if (signUpStatus) {
      switch (signUpStatus) {
        case "loading":
          setIsLoading(true);
          setShowSuccessMsg(false);
          break;
        case "success":
          setIsLoading(false);
          setShowSuccessMsg(true);
          setTimeout(() => {
            props.setShowSignUpModal(false);
            setShowSuccessMsg(false);
            reset();
          }, SIGNUP_TIMEOUT_TIME);
          break;
        case "failed":
          setIsLoading(false);
          setShowSuccessMsg(false);
          break;
      }
    }
  }, [signUpStatus]);

  const signUpModalOnCloseHandler = () => {
    props.setShowSignUpModal(false);
    reset();
  };

  const signUpHandler = (data) => {
    dispatch(signUpThunk(data));
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
