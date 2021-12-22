import modalClasses from "../../../styles/modalClasses.module.css";
import { Modal, Fade } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../../store/index";
import { FindUser } from "../../utils/helpers";

function AddIngsToShopListModal(props) {
  const dispatch = useDispatch();
  const foundUser = FindUser();

  const showAddIngsToShopListModalOnCloseHandler = () => {
    props.setShowIngToShopListModal(false);
  };

  const addIngsToShopListHandler = () => {
    dispatch(
      fridgeActions.addMissingIngsToShopList({
        user: foundUser,
        ingredients: props.ingredients,
      })
    );
    props.setShowIngToShopListModal(false);
  };

  const addIngsToShopListModal = (
    <div className={modalClasses.main}>
      <h2>Do you want to add missing ingredients to the shopping list ?</h2>
      <h6>If you already have some of the amount, it will be subsracted</h6>
      <div className={modalClasses.yesno_btn}>
        <button onClick={addIngsToShopListHandler}>Yes</button>
        <button onClick={showAddIngsToShopListModalOnCloseHandler}>No</button>
      </div>
    </div>
  );

  return (
    <Modal
      open={props.showIngToShopListModal}
      onClose={showAddIngsToShopListModalOnCloseHandler}
    >
      <Fade in={props.showIngToShopListModal}>{addIngsToShopListModal}</Fade>
    </Modal>
  );
}

export default AddIngsToShopListModal;
