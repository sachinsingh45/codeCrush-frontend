import { Provider, useSelector } from "react-redux";
import appStore from "./utils/appStore";
import AppRoutes from "./AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { createGlobalSocketConnection } from "./utils/socket";

function GlobalSocketInit() {
  const user = useSelector((store) => store.user.user);
  useEffect(() => {
    if (user?._id) {
      createGlobalSocketConnection(user._id);
    }
  }, [user?._id]);
  return null;
}

function App() {
  return (
    <Provider store={appStore}>
      <GlobalSocketInit />
      <AppRoutes />
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  );
}

export default App;