import modalClasses from "../styles/modalClasses.module.css";

function InputError(props) {
  const error = props.ingredients
    ? props.errorMessage.ingName.message
    : props.errorMessage;

  return (
    <div className={modalClasses.error}>
      <p>{error}</p>
    </div>
  );
}

export default InputError;
