# Project Name

> The Fridge
> Live demo [https://the-fridge-two.vercel.app/]

## Table of Contents

- [General Info](#general-information)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Screenshots](#screenshots)
- [Setup](#setup)
- [Usage](#usage)
- [Project Status](#project-status)
- [Room for Improvement](#room-for-improvement)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## General Information

The Fridge is a tool to help better manage contents of a fridge. It divides in three main features.

First one is My Food, where an user can store information about bought and already stored products such as:

- Name
- Type
- Weight
- Quantity
- Expiration Date

Furthermore it gives you ability to check summary, edit, sort, send to shopping list(in development).
Products date which is expired/about to expire is highlited.
The information is stored online, so an user can always check it, for instance whilst shopping.

Second feature is My Recipes(in development). User can create his/her own recipes, where it will be shown which ingredients are missing with an option to pass given ingredients to shopping list.

Third feature is My Shopping List (in development). A simple list of products to buy with an option to add, edit, remove.

I was inspired to start this project by my family which often wastes food by buying new products while ones already bought are close to be expired.

Another reason is to help my freshly started career as a Frontend Developer.

## Technologies Used

- Next.js 11.1.2
- Redux toolkit 1.6.1 (Redux 4.1.1)
- Node.js 14.15.3 (in order to run development server)
- Firebase 9.1.3 (Firestore and Authentication)
- Material-UI

## Features

List the ready features here:

- Fridge (My Food)
- Recipes (in development)
- Shopping list (in development)

## Screenshots

![Food example](./public/tablescreen2.jpg)

<!-- If you have screenshots you'd like to share, include them here. -->

## Setup

Install Node.js on your computer (https://nodejs.org/en/)
Install dependencies - `npm install`
Start development server - `npm run dev`

## Usage

 Pages that should be used only if user is logged in are protected with components/control/withAuth.js, which checks if an user is logged in. If he is not, user is redirected to the main page.

```jsx
function withAuth(WrappedComponent) {
return function Auth(props) {
const router = useRouter();
const dispatch = useDispatch();

    if (typeof window !== "undefined") {
      const getUserId = localStorage.getItem("userId");

      if (getUserId) {
        try {
          async () => {
            const docRef = doc(db, "users", getUserId);
            const docSnap = await getDoc(docRef);
            const getUser = docSnap.data();

            dispatch(
              fridgeActions.login({
                username: getUser.username,
                id: getUserId,
                foodId: getUser.foodId,
                totalQuantity: getUser.totalQuantity,
                totalWeight: getUser.totalWeight,
                food: getUser.food,
              })
            );
          };
        } catch (err) {
          alert("Something went wrong ! Please try again");
          console.error(err);
        }

        return <WrappedComponent {...props} />;
      } else if (!getUserId) {
        router.replace("/");

        return null;
      }
    }
    return null;

};
}
```

 components/control/initFirebase.js contains information required to connect to Firebase as well as a function which makes it easier to work with Authentication.

```jsx
function AuthURL(firebaseAuthAction) {
    return `${AUTH_BASIC_URL}${firebaseAuthAction}?key=${firebaseConfig.apiKey}`; }
```

- AUTH_BASIC_URL - Main page of Firebase Authentication, string
- firebaseAuthAction - a string to identify the fetch method such as `signUp` or `signInWithPassword`
- firebaseConfig - object of strings, with Firebase details required for connection



 components/control/config.js contains non programmable details about column names, type of food names, configuration of max length of inputs, minimal amount of days to highlight expiration date and colors code hexes

 components/utils/helpers.js contains a set of reusable functions

 function returning a color out of config depending on the type

```jsx
function setBackgroundColor(type) {
  if (type === "Protein") {
    return PROTEIN_COLOR;
  } else if (type === "Dairy") {
    return DAIRY_COLOR;
  } else if (type === "Vegetables") {
    return VEGETABLES_COLOR;
  } else if (type === "Fruits") {
    return FRUITS_COLOR;
  } else if (type === "Drinks") {
    return DRINKS_COLOR;
  } else if (type === "Other") {
    return OTHER_COLOR;
  }
}
 ```

 function that sets a limit to max input length of inputs that are type of `number`. Takes in `maxLength` which an input element must have.

```jsx
function maxLengthCheck(e) { 
    if (e.target.value.length > e.target.maxLength) { 
        e.target.value = e.target.value.slice(0, e.target.maxLength); } }
```

 function that takes a date and creates a `new Date` object and transforms it to miliseconds
  ```jsx
  function sortDateHelper(date) { 
      if (!date) return ""; 
      const dateObj = new Date(date).getTime(); return dateObj; }
  ```

 components/utils.Spinner.js contains reusable spinner which can take a prop `big` in order to increase its size.

```jsx
function Spinner(props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <div className={classes.container}>
        <div className={props.big ? classes.spinner_big : classes.spinner}>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              focusable="false"
            >
              <circle
                cx="14"
                cy="14"
                r="12"
                fill="none"
                stroke="#000"
                strokeWidth="4"
                opacity=".15"
              />
              <circle
                pathLength="1"
                cx="14"
                cy="14"
                r="12"
                fill="none"
                stroke="#01c09a"
                strokeWidth="4"
                strokeDasharray="27 57"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    )
  );
}
```

 pages/food/SummaryModalValues.js takes in an array of users food, transforms values into a string :

```jsx
const countTypeValues = (type) => {
    let quantity = 0;
    let weight = 0;

    const filteredArr = props.rows?.filter((ele) => {
      return ele.type === type;
    });
    
    filteredArr?.forEach((arr) => {
      quantity += +arr.quantity;
      weight += +arr.weight;
    });

    return `Quantity: ${quantity}, Weight(g): ${weight}`;
  };
```

and returns as an element based on `TYPES` from config

```jsx
  return TYPES.map((type) => {
    return (
      <Fragment key={type}>
        <h4>{type}</h4>
        <p>{countTypeValues(type)}</p>
      </Fragment>
    );
  });
```

 pages/food/TableHeadRowCells.js returns a set of Material UI`s TableCells meant as a Head row. It contains column names from COLUMNS from config.js(given as props) and proper styling for each of them. Furthermore it contains sorting icon which based on sorting logic in Redux store shows arrow up or down, on clicked column also stored in Redux

```jsx
function TableHeadRowCells(props) {
  const fridgeSortedField = useSelector((state) => state.sortedField);
  const fridgeSortDirection = useSelector((state) => state.sortDirection);
  const users = useSelector((state) => state.users);
  const foundUser = users.find((user) => user?.id !== null);

  const sortIcon =
    foundUser?.food?.length > 0 &&
    fridgeSortedField === props?.column?.id &&
    (fridgeSortDirection === "asc" ? sortArrowDownIcon : sortArrowUpIcon);

  //MUI STYLES

  const tableHeadCellStyleMUI = {
    userSelect: "none",
    backgroundColor: "#004d3e1f",
    borderBottom: "4px solid #01c09af8",
    fontSize: 22,
    fontWeight: 700,
    color: "#050f16d8",
    fontFamily: "Open Sans",
    cursor: props?.column?.id === "action" ? "inherit" : "pointer",
    borderTopLeftRadius: props?.column?.id === "id" ? "15px" : "0px",
    borderTopRightRadius: props?.column?.id === "action" ? "15px" : "0px",
  };

  return (
    <TableCell
      onClick={props.sortByColumn}
      key={props?.column?.id}
      style={tableHeadCellStyleMUI}
    >
      <div className={classes.icon_container}>{sortIcon}</div>
      <div>{props?.column?.label}</div>
    </TableCell>
  );
}
```

 pages/food/TableRowAndCell.js returns as a row in table each element in food object of an user, which takes as prop. Other than logic for Edit and Remove food and modals, it contains:

 functions to transform date to proper local format and highlight it if expired/about to expire

```jsx
const checkExpDateStyle = (date) => {
    const formattedDate = new Date(date);
    const now = new Date();
    const dayInMs = 86400000;
    const daysToExpire = (formattedDate - now) / dayInMs;

    if (daysToExpire < 0) {
      return [COLOR_EXPIRED, "700"];
    } else if (
      daysToExpire >= 0 &&
      daysToExpire <= MINDAYS_TO_SHOW_RED_EXPDATE
    ) {
      return [COLOR_ABOUT_TO_EXPIRE, "700"];
    } else {
      return [COLOR_VALID, "500"];
    }
  };

  const showCorrectDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };
```

 edit Modal and edit handler, with editing to Firebases Firestore and pushing to Redux

```jsx
const editModal = (
    <form className={modalClasses.main} onSubmit={submitEditFoodHandler}>
      <div>
        <div key={props?.row?.name}>
          <label>Name</label>
          <input
            defaultValue={props?.row?.name}
            ref={editFoodName}
            type="text"
            autoFocus={true}
            maxLength={FOODNAME_MAX_LENGTH}
            required
          />
        </div>
        <div key={props?.row?.type}>
          <label>Type</label>
          <select
            name="typelistEditFood"
            id="typelistEditFood"
            ref={editFoodType}
            defaultValue={props?.row?.type}
            required
          >
            {TYPES.map((type) => {
              return (
                <option key={type} value={type}>
                  {type}
                </option>
              );
            })}
          </select>
        </div>
        <div key={props?.row?.quantity * Math.random()}>
          <label>Quantity</label>
          <input
            defaultValue={props?.row?.quantity}
            ref={editFoodQuantity}
            type="number"
            min="0"
            maxLength={QUANTITY_MAX_LENGTH}
            onInput={maxLengthCheck}
            required
          />
        </div>
        <div key={props?.row?.weight * Math.random()}>
          <label>Weight(g)</label>
          <input
            defaultValue={props?.row?.weight}
            ref={editFoodWeight}
            type="number"
            min="0"
            maxLength={WEIGHT_MAX_LENGTH}
            onInput={maxLengthCheck}
            required
          />
        </div>
        <div key={props?.row?.expDate * Math.random()}>
          <label>Expiration Date</label>
          <input
            type="date"
            defaultValue={props?.row?.expDate}
            ref={editFoodExpDate}
            required
          />
        </div>
      </div>
      <div className={modalClasses.btn_container}>
        <button>Confirm</button>
      </div>
    </form>
  );

const submitEditFoodHandler = async (e) => {
    e.preventDefault();

    try {
      const foodObj = {
        username: foundUser.username,
        id: props.row.id,
        foodId: foundUser.foodId,
        name: editFoodName.current.value,
        type: editFoodType.current.value,
        quantity: editFoodQuantity.current.value,
        weight: editFoodWeight.current.value,
        expDate: editFoodExpDate.current.value,
        key: props.row.key,
      };

      const foodCopy = [...foundUser.food];
      const foundUserFoodIndex = foodCopy.findIndex(
        (ele) => +ele.id === +props.row.id
      );

      foodCopy[foundUserFoodIndex] = {
        name: editFoodName.current.value,
        type: editFoodType.current.value,
        quantity: editFoodQuantity.current.value,
        weight: editFoodWeight.current.value,
        expDate: editFoodExpDate.current.value,
        id: props.row.id,
        key: props.row.key,
      };

      const payload = {
        username: foundUser.username,
        foodId: foundUser.foodId,
        totalWeight:
          foundUser.totalWeight -
          props.row.weight +
          +editFoodWeight.current.value,
        totalQuantity:
          foundUser.totalQuantity -
          props.row.quantity +
          +editFoodQuantity.current.value,
        food: foodCopy,
      };

      const docRef = doc(db, "users", foundUser.id);
      await setDoc(docRef, payload);
      dispatch(fridgeActions.editFood(foodObj));

      editFoodName.current.value = "";
      editFoodType.current.value = "";
      editFoodQuantity.current.value = "";
      editFoodWeight.current.value = "";
      editFoodExpDate.current.value = "";
      setShowEditModal(false);
    } catch (err) {
      alert("Something went wrong ! Please try again");
      console.error(err);
    }
  };
```

 and remove handler, also with connection to Firebase and Redux

```jsx
const removeFoodHandler = async (e) => {
    e.preventDefault();

    try {
      const foodFiltered = foundUser.food.filter(
        (ele) => ele.id !== props.row.id
      );
      const payload = {
        username: foundUser.username,
        foodId: foundUser.foodId,
        totalWeight: foundUser.totalWeight - props.row.weight,
        totalQuantity: foundUser.totalQuantity - props.row.quantity,
        food: foodFiltered,
      };

      const docRef = doc(db, "users", foundUser.id);
      await setDoc(docRef, payload);

      dispatch(
        fridgeActions.removeFood({
          username: foundUser.username,
          foodToRemove: props.row,
        })
      );
    } catch (err) {
      alert("Something went wrong ! Please try again");
      console.error(err);
    }
  };

```

 function returns a Table Row which based on column (formatted value or icon buttons for passing to shopping list, edit and remove)

```jsx
  return (
    <Fade in={!!foundUser}>
      <TableRow tabIndex={-1} style={tableRowStyleMUI}>
        {props?.columns?.map((column) => {
          const value = props.row[column.id];

          return (
            <TableCell key={column.id} style={tableCellStyleMUI(column, value)}>
              {
                //IF ITS EXPIRATION DATE COLUMN, SHOW CORRECTED DATE WITH CORRECTED STYLE
                column.id === "expDate" ? (
                  checkExpDateStyle(value)[0] === COLOR_ABOUT_TO_EXPIRE ? (
                    `! ${showCorrectDate(value)} !`
                  ) : (
                    showCorrectDate(value)
                  )
                ) : //IF ITS ACTION COLUMN, SHOW ACTION ICONS
                column.id === "action" ? (
                  <div className={classes.icon_container}>
                    <div className={classes.icon}>
                      <AddtoListIcon />
                    </div>
                    <div className={classes.icon}>
                      <EditFoodIcon
                        editModalOpen={() => setShowEditModal(true)}
                      />
                    </div>
                    <div className={classes.icon}>
                      <RemoveFoodIcon removeFoodHandler={removeFoodHandler} />
                    </div>
                  </div>
                ) : (
                  //ELSE SHOW VALUE
                  value
                )
              }
            </TableCell>
          );
        })}
        <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
          <Fade in={showEditModal}>{editModal}</Fade>
        </Modal>
      </TableRow>
    </Fade>
  );
}
```

REDUX - store/index.js - contains state for :
- sort field and direction, reducer: `sortByColumn`
- users data, reducers: `login`, `logout`, `createUser`
- users food data, reducers: `addFood`, `editFood`, `removeFood`

- state object description:


| property              | type            | description                                                                                  |
| --------------------- | --------------- | -------------------------------------------------------------------------------------------- |
| `sortedField`         | `string`        | Currently sorted field                                                                       |
| `sortDirection`       | `desc`/`asc`    | Sorting in ascending or descending order                                                     |
| `users`               | `object`        | Object containing users data                                                                 |
| `users.username`      | `string`        | Given name of a user                                                                         |
| `users.foodId`        | `number`        | Id of food element, rising with every addition                                               |
| `users.id`            | `number`        | Id of user from Firebase Authentication and stored in local storage                          |
| `users.totalQuantity` | `number`        | Total sum of all food element quantities                                                     |
| `users.totalWeight`   | `number`        | Total sum of all food element weights                                                        |
| `users.food`          | `object`        | Object containing all of the users added food                                                |
| `food.name`           | `string`        | Inputted name of food                                                                        |
| `food.type`           | `string`        | Type of food, selectable from config.js TYPES variable                                       |
| `food.quantity`       | `number`        | Quantity of added food, max 999 (from config.js)                                             |
| `food.weight`         | `number`        | Weight of added food, max 9999 (from config.js)                                              |
| `food.expDate`        | `date`          | Inputted exp date, used standard select Javascript date picker                               |
| `food.key`            | `number`        | Used for setting keys in div elements                                                        |
| `food.id`             | `number`        | Taken from users.foodId, sets the of added food element                                      |


 Redux contains also Middleware that helps accessing local storage for rendering, logging in and logging out(not normally available in Redux slice)

```jsx
const authMiddleware =
  ({ dispatch, store }) =>
  (next) =>
  (action) => {
    if (fridgeActions.login.match(action)) {
      localStorage.setItem("userId", action.payload.id);
    } else if (fridgeActions.logout.match(action)) {
      localStorage.removeItem("userId");
    }
    return next(action);
  };
```




## Project Status

Project is: in progress.

## Room for Improvement

Room for improvement:

- Add more reliable authentication
- Improve sorting function
- Write clearer and better working CSS
- Add auto-logout using expiring tokens
- Better error handling whilst fetching data to/from Firestore
- Make shorter readme ???

To do:

- Recipes
- Shopping list
- Cooperation between the features
- Media queries

## Acknowledgements

This project was based on :

- [React - The Complete Guide (incl Hooks, React Router, Redux) by Maximilian Schwarzmuller](https://www.udemy.com/course/react-the-complete-guide-incl-redux/)
- [The Complete JavaScript Course 2021: From Zero to Expert! by Jonas Schmedtmann](https://www.udemy.com/course/the-complete-javascript-course/)

## Contact

Created by [@MarcinSutula](https://github.com/MarcinSutula) - feel free to contact me!
````
