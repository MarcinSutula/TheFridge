import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Modal,
  Fade,
} from "@material-ui/core";
import { useState, useRef, useEffect } from "react";
import { fridgeActions } from "../../store/index";
import { useSelector, useDispatch } from "react-redux";
import classes from "./food.module.css";
import modalClasses from "../../styles/modalClasses.module.css";
import TableRowAndCell from "./TableRowAndCell";
import TableHeadRowCells from "./TableHeadRowCells";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../components/control/initFirebase";
import withAuth from "../../components/control/withAuth";
import Spinner from "../../components/utils/Spinner";
import { maxLengthCheck } from "../../components/utils/helpers";
import {
  COLUMNS,
  QUANTITY_MAX_LENGTH,
  WEIGHT_MAX_LENGTH,
  FOODNAME_MAX_LENGTH,
  INITIAL_ROWS_PER_PAGE,
  TYPES,
} from "../../components/control/config";
import SummaryModalValues from "./SummaryModalValues";

function MainTable() {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(INITIAL_ROWS_PER_PAGE);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const addFoodName = useRef();
  const addFoodType = useRef();
  const addFoodQuantity = useRef();
  const addFoodWeight = useRef();
  const addFoodExpDate = useRef();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const foundUser = users.find((user) => user.id !== null);

  // To get rid of error Warning: Expected server HTML to contain a matching <div> in <div>..
  useEffect(() => {
    setMounted(true);
  }, []);

  let rows;
  if (foundUser) {
    rows = foundUser.food;
    if (!mounted) return <Spinner big={true} />;
  } else if (!foundUser) {
    rows = [];
    return <Spinner big={true} />;
  }

  const sortByColumn = (e) => {
    const clickedColumn = e.target.innerText;

    dispatch(
      fridgeActions.sortByColumn({
        username: foundUser.username,
        columnName: clickedColumn,
      })
    );
  };

  const submitAddFoodHandler = (e) => {
    try {
      async () => {
        e.preventDefault();
        const docRef = doc(db, "users", foundUser.id);
        const foodObj = {
          id: foundUser.id,
          foodId: foundUser.foodId,
          username: foundUser.username,
          name: addFoodName.current.value,
          type: addFoodType.current.value,
          quantity: addFoodQuantity.current.value,
          weight: addFoodWeight.current.value,
          expDate: addFoodExpDate.current.value,
          key: foundUser.foodId,
        };

        const payload = {
          username: foundUser.username,
          foodId: foundUser.foodId + 1,
          totalQuantity:
            foundUser.totalQuantity + +addFoodQuantity.current.value,
          totalWeight: foundUser.totalWeight + +addFoodWeight.current.value,
          food: [
            ...foundUser.food,
            {
              name: addFoodName.current.value,
              type: addFoodType.current.value,
              quantity: addFoodQuantity.current.value,
              weight: addFoodWeight.current.value,
              expDate: addFoodExpDate.current.value,
              key: foundUser.foodId,
              id: foundUser.foodId,
            },
          ],
        };

        if (
          addFoodName.current.value.trim().length < 1 ||
          addFoodType.current.value === "DEFAULT" ||
          +addFoodQuantity.current.value < 0 ||
          addFoodQuantity.current.value.trim().length < 1 ||
          +addFoodWeight.current.value < 0 ||
          addFoodWeight.current.value.trim().length < 1
        ) {
          alert("Values other than Expiration Date must not be empty");
          return;
        }

        await setDoc(docRef, payload);

        dispatch(fridgeActions.addFood(foodObj));
        addFoodName.current.value = "";
        addFoodType.current.value = "";
        addFoodQuantity.current.value = "";
        addFoodWeight.current.value = "";
        addFoodExpDate.current.value = "";
        setShowAddFoodModal(false);
      };
    } catch (err) {
      alert("Something went wrong, please try again !");
      console.error(err);
    }
  };

  ///MATERIAL-UI FUNCTIONS
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  ///MODALS (DO NOT CREATE THEM AS ANOTHER COMPONENT)
  const addFoodModal = (
    <form className={modalClasses.main} onSubmit={submitAddFoodHandler}>
      <div>
        <label>Name </label>
        <input
          type="text"
          ref={addFoodName}
          autoFocus={true}
          maxLength={FOODNAME_MAX_LENGTH}
        />
      </div>
      <div>
        <label>Type </label>
        <select
          name="typelistAddFood"
          id="typelistAddFood"
          defaultValue={"DEFAULT"}
          ref={addFoodType}
        >
          <option value="DEFAULT" disabled hidden>
            Choose here
          </option>
          {TYPES.map((type) => {
            return (
              <option key={type} value={type}>
                {type}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        <label>Quantity </label>
        <input
          type="number"
          ref={addFoodQuantity}
          maxLength={QUANTITY_MAX_LENGTH}
          min="0"
          onInput={maxLengthCheck}
        />
      </div>
      <div>
        <label>Weight </label>
        <input
          type="number"
          ref={addFoodWeight}
          min="0"
          maxLength={WEIGHT_MAX_LENGTH}
          onInput={maxLengthCheck}
        />
      </div>
      <div>
        <label>Expiration Date </label>
        <input type="date" ref={addFoodExpDate} />
      </div>
      <div className={modalClasses.btn_container}>
        <button>Confirm</button>
      </div>
    </form>
  );

  const summaryModal = (
    <div className={`${modalClasses.main} ${modalClasses.summary}`}>
      <h2>Summary</h2>
      <h3>{`Total quantity of items: ${
        foundUser?.totalQuantity ? foundUser.totalQuantity : 0
      }`}</h3>
      <h3>{`Total weight of items: ${
        foundUser?.totalWeight ? foundUser.totalWeight : 0
      }`}</h3>
      <SummaryModalValues rows={rows} />
    </div>
  );

  //MUI STYLES

  const paperStyleMUI = {
    position: "absolute",
    left: "2.5%",
    top: "10%",
    minWidth: "1000px",
    width: "95%",

    marginBotton: 0,
    boxShadow: "0 40px 60px 0 rgb(0, 0, 0, 0.35)",
    borderRadius: "15px",
    overflow: "hidden",
  };

  const tableContainerStyleMUI = {
    maxHeight: 760,
  };

  return (
    mounted && (
      <div className={classes.background}>
        <div>
          <Paper style={paperStyleMUI}>
            <TableContainer style={tableContainerStyleMUI}>
              <Table>
                <TableHead>
                  <TableRow>
                    {COLUMNS.map((column) => (
                      <TableHeadRowCells
                        sortByColumn={sortByColumn}
                        column={column}
                        key={column.id}
                      />
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((row) => {
                      return (
                        <TableRowAndCell
                          columns={COLUMNS}
                          row={row}
                          key={row.key}
                        />
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <div className={`${classes.btn_container}`}>
              <div>
                <button
                  className={`${classes.food_btn}`}
                  onClick={() => setShowAddFoodModal(true)}
                >
                  Add Food
                </button>
                <button
                  className={`${classes.food_btn}`}
                  onClick={() => setShowSummaryModal(true)}
                >
                  Summary
                </button>
              </div>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows ? rows.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
            <Modal
              open={showAddFoodModal}
              onClose={() => setShowAddFoodModal(false)}
            >
              <Fade in={showAddFoodModal}>{addFoodModal}</Fade>
            </Modal>
            <Modal
              open={showSummaryModal}
              onClose={() => setShowSummaryModal(false)}
            >
              <Fade in={showSummaryModal}>{summaryModal}</Fade>
            </Modal>
          </Paper>
        </div>
      </div>
    )
  );
}

export default withAuth(MainTable);
