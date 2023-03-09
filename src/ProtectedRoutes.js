import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { useStateValue } from "./config/context api/StateProvider";

function ProtectedRoutes({ component: Component, ...rest }) {
  const [isAuth, setIsAuth] = useState(false);
  const [{ userToken }, dispatch] = useStateValue();

  useEffect(() => {
    if (
      //   localStorage.getItem("user-info-token") == 0 &&
      //   localStorage.getItem("user-info-token") == null
      userToken === 0 ||
      userToken === null ||
      userToken === "" ||
      localStorage.getItem("user-info-token") === 0 ||
      localStorage.getItem("user-info-token") === null
    ) {
      setIsAuth(false);
    }
  }, [userToken]);
  // console.log("testing in protected Routh", isAuth);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (userToken !== 0) return <Component {...props} />;
        if (userToken === 0) {
          return (
            <Redirect
              to={{
                pathname: "/authentication/sign",
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
}

export default ProtectedRoutes;
