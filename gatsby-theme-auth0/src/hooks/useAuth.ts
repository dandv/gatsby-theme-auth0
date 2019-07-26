import * as React from "react";
import auth from "../auth/service";
import sessionStateCallback from "./sessionStateCallback";

const useAuth = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(auth.isAuthenticated());
  const [profile, setProfile] = React.useState(auth.getUserProfile());

  React.useEffect(() => {
    // Override `sessionStateCallback` in auth service
    auth.sessionStateCallback = state => {
      sessionStateCallback(state);
      setIsLoggedIn(state.isLoggedIn);
    };

    (async () => {
      await auth.checkSession();
      try {
        const user = auth.getUserProfile();
        setProfile(user);
      } catch (error) {
        console.log(`Error: ${error}`);
      }

      setIsLoading(false);
    })();

    return () => {
      // Clean up sessionStateCallback
      auth.sessionStateCallback = () => {};
    };
  }, []);

  return {
    isLoading,
    isLoggedIn,
    profile,
  };
};

export default useAuth;
