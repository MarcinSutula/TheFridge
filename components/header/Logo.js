import { LogoIcon } from "../utils/icons";
import classes from "./Logo.module.css";
import { useRouter } from "next/router";

function Logo() {
  const router = useRouter();

  return (
    <div className={classes.logo}>
      <LogoIcon logoRedirect={() => router.push("/")} />
      <h2 onClick={() => router.push("/")}>The Fridge</h2>
    </div>
  );
}

export default Logo;
