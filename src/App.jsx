import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import AppRoutes from "./AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={appStore}>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </Provider>
  );
}

export default App;