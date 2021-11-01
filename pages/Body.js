import classes from "./Body.module.css";
import { Slide } from "@material-ui/core";
import { useState, useEffect } from "react";

function Body() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  //DOESNT WORK IN THE SAME USEEFFECT
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  const scrollToColumnsHandler = () => {
    const element = document.getElementById("body_columns");
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    });
  };

  return (
    mounted && (
      <div className={classes.body_welcome}>
        <Slide
          direction="left"
          in={mounted}
          timeout={1700}
          mountOnEnter
          unmountOnExit
        >
          <h1 className={classes.body_title}>Welcome to the Fridge !</h1>
        </Slide>
        <Slide
          direction="left"
          in={mounted}
          timeout={2200}
          mountOnEnter
          unmountOnExit
        >
          <p>
            The Fridge is a simple website helping you to better manage the
            contents of your fridge, but not only ! You can also add recipes,
            compare them with your stored ingredients and create a shopping
            list.
          </p>
        </Slide>
        <Slide
          direction="left"
          in={mounted}
          timeout={2300}
          mountOnEnter
          unmountOnExit
        >
          <div className={classes.btn_container}>
            <button
              className={classes.body_welcome_btn}
              onClick={scrollToColumnsHandler}
            >
              See how it works !
            </button>
          </div>
        </Slide>
      </div>
    )
  );
}

export default Body;
