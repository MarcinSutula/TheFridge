import withAuth from "../../components/control/withAuth";
import classes from "./recipes.module.css";
import { useState, useEffect } from "react";

function Recipes() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    mounted && (
      <div className={classes.background}>
        <div className={classes.temporary}>
          <h1>My Recipes</h1>
          <blockquote>
            Aenean pretium libero id ipsum sollicitudin cursus. Mauris ac orci
            pulvinar, blandit ligula sit amet, interdum sapien. Aenean consequat
            hendrerit nulla. Suspendisse potenti. Fusce aliquam pulvinar
            fringilla. Nunc vitae felis ornare, luctus mi id, laoreet nisi. Nunc
            ut lacinia felis, et pretium augue. Suspendisse consequat, lectus
            vel euismod tristique, odio justo rutrum leo, id sollicitudin dolor
            ex vel nunc. Nulla lobortis accumsan tellus ac lacinia. Curabitur
            nec efficitur enim. Cras suscipit sem non dictum auctor. Integer
            mattis gravida enim.
          </blockquote>
        </div>
      </div>
    )
  );
}

export default withAuth(Recipes);
