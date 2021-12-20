import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import { fridgeActions } from "../../store/index";
import { useDispatch } from "react-redux";
import classes from "./food.module.css";
import TableRowAndCell from "./TableRowAndCell";
import TableHeadRowCells from "./TableHeadRowCells";
import withAuth from "../../components/control/withAuth";
import Spinner from "../../components/utils/Spinner";
import { findUser } from "../../components/utils/helpers";
import {
  COLUMNS,
  INITIAL_ROWS_PER_PAGE,
} from "../../components/control/config";
import AddFoodModal from "../../components/modals/food/addFoodModal";
import SummaryModal from "../../components/modals/food/SummaryModal";

function MainTable() {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(INITIAL_ROWS_PER_PAGE);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const dispatch = useDispatch();
  const foundUser = findUser();
  let rows;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (foundUser) {
    rows = foundUser.food;
    if (!mounted) return <Spinner big={true} />;
  } else {
    rows = [];
    return <Spinner big={true} />;
  }

  const sortByColumnHandler = (e) => {
    const clickedColumn = e.target.id;

    dispatch(
      fridgeActions.sortByColumn({
        user: foundUser,
        columnId: clickedColumn,
      })
    );
  };

  const addFoodBtnHandler = () => {
    setShowAddFoodModal(true);
  };

  const summaryBtnHandler = () => {
    setShowSummaryModal(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    mounted && (
      <div className={classes.background}>
        <div>
          <Paper className={classes.table_paper_mui}>
            <TableContainer className={classes.table_container_mui}>
              <Table>
                <TableHead>
                  <TableRow>
                    {COLUMNS.map((column) => (
                      <TableHeadRowCells
                        sortByColumnHandler={sortByColumnHandler}
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
                          key={row.id}
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
                  onClick={addFoodBtnHandler}
                >
                  Add Food
                </button>
                <button
                  className={`${classes.food_btn}`}
                  onClick={summaryBtnHandler}
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
            <AddFoodModal
              showAddFoodModal={showAddFoodModal}
              setShowAddFoodModal={setShowAddFoodModal}
            />
            <SummaryModal
              rows={rows}
              showSummaryModal={showSummaryModal}
              setShowSummaryModal={setShowSummaryModal}
            />
          </Paper>
        </div>
      </div>
    )
  );
}

export default withAuth(MainTable);
