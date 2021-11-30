import modalClasses from "../../../styles/modalClasses.module.css";
import { useSelector } from "react-redux";
import SummaryModalValues from "../../../pages/food/SummaryModalValues";
import { Modal, Fade } from "@material-ui/core";

function SummaryModal(props) {
  const users = useSelector((state) => state.users);
  const foundUser = users.find((user) => user.id !== "");

  const summaryModalOnCloseHandler = () => {
    props.setShowSummaryModal(false);
  };

  const summaryModal = (
    <div className={`${modalClasses.main} ${modalClasses.summary}`}>
      <h2>Summary</h2>
      <h3>{`Total quantity of items: ${
        foundUser?.totalQuantity ? foundUser.totalQuantity : 0
      }`}</h3>
      <h3>{`Total weight of items: ${
        foundUser?.totalWeight ? foundUser.totalWeight : 0
      }`}</h3>
      <SummaryModalValues rows={props.rows} />
    </div>
  );

  return (
    <Modal open={props.showSummaryModal} onClose={summaryModalOnCloseHandler}>
      <Fade in={props.showSummaryModal}>{summaryModal}</Fade>
    </Modal>
  );
}

export default SummaryModal;
