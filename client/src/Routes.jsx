import RegisterAndLoginForm from "./RegisterAndLoginForm.jsx";
import { useContext } from "react";
import { UserContext } from "./UserContext.jsx";
import Chat from "./Chat";
import ErrorBoundary from "./ErrorBoundary.jsx";
import ErrorLandingPage from "./ErrorLandingPage.jsx";

const Routes = () => {
  const { username, id } = useContext(UserContext);

  if (username) {
    return (
      <ErrorBoundary fallback={<ErrorLandingPage />}>
        <Chat />
      </ErrorBoundary>
    );
  }

  return <RegisterAndLoginForm />;
};

export default Routes;
