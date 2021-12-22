import modalClasses from "../../../styles/modalClasses.module.css";
import { Modal, Fade } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../../store/index";
import { FindUser } from "../../utils/helpers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FOODNAME_MAX_LENGTH, WEIGHT_MAX_LENGTH } from "../../control/config";

function AddFoodToShopListModal(props) {
  const [showEditFoodToShopListItem, setShowEditFoodToShopListItem] =
    useState(false);
  const dispatch = useDispatch();
  const foundUser = FindUser();
  const foodToShopListItem = props?.row?.weight + "," + props?.row?.name;
  const defaultValues = { editAddToShopListItem: foodToShopListItem };
  const { register, handleSubmit, reset } = useForm({ defaultValues });

  const addFoodToShopListOnCloseHandler = () => {
    props?.setShowAddFoodToShopListModal(false);
    setShowEditFoodToShopListItem(false);
    reset();
  };

  const addFoodToShopListHandler = (data) => {
    dispatch(
      fridgeActions.addShoppingListItem({
        user: foundUser,
        listItem: showEditFoodToShopListItem
          ? data.editAddToShopListItem
          : foodToShopListItem,
      })
    );

    props?.setShowAddFoodToShopListModal(false);
    reset();
  };

  const addFoodToShopListEditBtnHandler = () => {
    setShowEditFoodToShopListItem(true);
  };

  const cancelEditFoodToShopListHandler = () => {
    setShowEditFoodToShopListItem(false);
    reset();
  };

  const addFoodToShopList = (
    <form
      className={modalClasses.main}
      onSubmit={handleSubmit(addFoodToShopListHandler)}
    >
      <h2>Would you like add {foodToShopListItem} to the shopping list ?</h2>
      {!showEditFoodToShopListItem && (
        <div className={modalClasses.yesno_btn}>
          <button>Yes</button>
          <button type="button" onClick={addFoodToShopListOnCloseHandler}>
            No
          </button>
          <button type="button" onClick={addFoodToShopListEditBtnHandler}>
            Edit
          </button>
        </div>
      )}
      {showEditFoodToShopListItem && (
        <div>
          <div className={modalClasses.edit_addtoshoplist_input}>
            <input
              type="text"
              {...register("editAddToShopListItem")}
              required
              maxLength={FOODNAME_MAX_LENGTH + WEIGHT_MAX_LENGTH}
            />
          </div>
          <div className={modalClasses.yesno_btn}>
            <button>Confirm</button>
            <button type="button" onClick={cancelEditFoodToShopListHandler}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </form>
  );

  return (
    <Modal
      open={props.showAddFoodToShopListModal}
      onClose={addFoodToShopListOnCloseHandler}
    >
      <Fade in={props.showAddFoodToShopListModal}>{addFoodToShopList}</Fade>
    </Modal>
  );
}

export default AddFoodToShopListModal;
