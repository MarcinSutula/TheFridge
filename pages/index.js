import { Fragment } from "react";
import Body from "./Body";
import BodyColumns from "./BodyColums";
import BodyFridgeDescription from "./BodyFridgeDescription";
import BodyRecipesDescription from "./BodyRecipesDescription";
import BodyShoppingListDescription from "./BodyShoppingListDescription";
import { useEffect, useState } from "react";
import { fetchFirestoreData } from "../components/control/initFirebase";
import { useDispatch } from "react-redux";
import { ALERT_OTHER } from "../components/control/config";
import { findUser } from "../components/utils/helpers";
import { fridgeActions } from "../store/index";
import { Spinner } from "../components/utils/Spinner";

function Home() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const foundUser = findUser();

  useEffect(() => {
    setMounted(true);
    try {
      const storageId = localStorage.getItem("userId");
      if (storageId && !foundUser) {
        (async () => {
          const userData = await fetchFirestoreData(storageId, "get");
          dispatch(
            fridgeActions.autoLogin({
              user: { ...userData },
              id: storageId,
            })
          );
        })();
      }
    } catch (err) {
      alert(ALERT_OTHER);
      console.error(err);
    }
  }, []);
  
  return (
    mounted && (
      <Fragment>
        <Body />
        <BodyColumns />
        <BodyFridgeDescription />
        <BodyRecipesDescription />
        <BodyShoppingListDescription />
      </Fragment>
    )
  );
}

export default Home;
