import { useEffect } from "react";
import { useRouter } from "next/router";

//For redirecting from wildcard path matching

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    router.back();
  });

  return null;
}
