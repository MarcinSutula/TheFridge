export const COLUMNS = [
  { id: "id", label: "Id" },
  { id: "name", label: "Name" },
  { id: "type", label: "Type" },
  {
    id: "quantity",
    label: "Quantity",
    numeric: "true",
  },
  {
    id: "weight",
    label: "Weight",
    numeric: "true",
  },
  {
    id: "expDate",
    label: "Expiration Date",
    numeric: "true",
  },
  {
    id: "action",
    label: "Action",
  },
];

export const TYPES = [
  "Protein",
  "Dairy",
  "Vegetables",
  "Fruits",
  "Drinks",
  "Other",
];

// Add/edit food config

export const QUANTITY_MAX_LENGTH = 3;
export const WEIGHT_MAX_LENGTH = 7;
export const FOODNAME_MAX_LENGTH = 15;
export const INITIAL_ROWS_PER_PAGE = 10;
export const SIGNUP_TIMEOUT_TIME = 1500;
export const MINDAYS_TO_SHOW_RED_EXPDATE = 3;
export const WEIGHT_REGEX = /^\d{1,4}[mlkgcstTq]{1,2}$/;
// Add/edit recipe config

export const RECIPENAME_MAX_LENGTH = 15;
export const RECIPESERVINGS_MAX_LENGTH = 1;
export const RECIPETIME_MAX_LENGTH = 3;
export const RECIPEINGREDIENTS_MAX_LENGTH = 15;
export const RECIPEINGREDIENTS_MAX_AMOUNT_OF_INPUTS = 10;
export const RECIPEDESCRIPTION_MAX_LENGTH = 5000;
export const RECIPEINGREDIENTS_REGEX =
  /^\d{1,4}[mlkgpcstTq]{1,2}?,[a-zA-Z]{1}[a-zA-Z ]{1,25}[a-zA-Z]{1}$/;

//Row background colors

export const PROTEIN_COLOR = "#e16464"; //red
export const DAIRY_COLOR = "#ffe45e"; //yellow
export const VEGETABLES_COLOR = "#01c09af8"; //green
export const FRUITS_COLOR = "#c19a01"; //orange
export const DRINKS_COLOR = "#5a75e4"; //blue
export const OTHER_COLOR = "#f7f7f7"; //white

//Expiration date colors

export const COLOR_EXPIRED = "#5e0087"; //dark violet
export const COLOR_ABOUT_TO_EXPIRE = "#ff0000"; //red
export const COLOR_VALID = "#050f16d8"; //standard black

//Alerts

export const ALERT_OTHER = "Something went wrong ! Please try again";
export const ALERT_ING_FORMAT =
  "Ingredients must be kept in format: amount,name. Measure must be inserted next to amount.";
export const ALERT_ING_URL_EMPTY =
  "Values other than URL must not be empty. You must insert at least one ingredient";
export const ERROR_FOOD_EMPTY = "This cannot be empty";
export const ERROR_WEIGHT_FORMAT =
  "Weight must be inserted with measure. I.e: 100g, 50ml";
export const ERROR_QUANTITY_LENGTH = "Quantity cannot be greater than 999";
export const ERROR_FOODNAME_LENGTH = "Name cannot be longer than 15 characters";
export const ERROR_RECIPENAME_LENGTH =
  "Name cannot be longer than 15 characters";
export const ALERT_AUTH_FAIL = "Authentication failed ! Please try again";
export const ALERT_EMAIL_NOTFOUND = "E-mail not found";
export const ALERT_EMAIL_INVALID = "Invalid e-mail";
export const ALERT_EMAIL_EXISTS =
  "This e-mail has already been registered. Please choose another one";
export const ALERT_INVALID_PASSWORD = "Invalid password";
export const ALERT_WEAK_PASSWORD =
  "Password must contain at least 6 characters";
export const ALERT_USER_DISABLED = "This user has been disabled";
export const ERROR_SERVINGS_LENGTH = "Servings cannot be greater than 9";
export const ERROR_TIME_LENGTH = "Time cannot be greater than 999";
export const ERROR_ING_LENGTH =
  "An ingredient cannot have more than 15 characteres";
