import { Fragment } from "react";
import Body from "../components/home/Body";
import BodyColumns from "../components/home/BodyColums";
import BodyFridgeDescription from "../components/home/BodyFridgeDescription";
import BodyRecipesDescription from "../components/home/BodyRecipesDescription";
import BodyShoppingListDescription from "../components/home/BodyShoppingListDescription";
import { useEffect, useState } from "react";
import { fetchFirestoreData } from "../components/control/initFirebase";
import { useDispatch } from "react-redux";
import { ALERT_OTHER } from "../components/control/config";
import { FindUser } from "../components/utils/helpers";
import { fridgeActions } from "../store/index";
import Spinner from "../components/utils/Spinner";

function Home() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const foundUser = FindUser();

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

  return mounted ? (
    <Fragment>
      <Body />
      <BodyColumns />
      <BodyFridgeDescription />
      <BodyRecipesDescription />
      <BodyShoppingListDescription />
    </Fragment>
  ) : (
    <Spinner big={true} />
  );
}

export default Home;
