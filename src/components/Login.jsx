import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { toast } from "react-toastify";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      toast.error(err?.response?.data || "Something went wrong");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isLoginForm) {
        handleLogin();
      } else {
        handleSignUp();
      }
    }
  };

  return (
    <div className="mt-20 flex justify-center items-center">
      <div className="flex flex-col lg:flex-row w-full max-w-screen-lg rounded-lg gap-4 justify-center">
        {/* Left side - Image */}
        {isLoginForm && (
          <div
            className="w-full lg:w-1/2 bg-cover bg-center h-64 lg:h-auto"
            style={{ backgroundImage: 'url("/signup.png")' }}
          ></div>
        )}
        {!isLoginForm && (
          <div
            className="w-full lg:w-1/3 bg-cover bg-center h-64 lg:h-auto"
            style={{ backgroundImage: 'url("/login.png")' }}
          ></div>
        )}

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center items-center glass bg-base-100 dark:bg-base-200">
          <h2 className="text-3xl font-bold text-base-content mb-6">{isLoginForm ? "Login" : "Sign Up"}</h2>
          <div className="w-full">
            {!isLoginForm && (
              <>
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text">First Name</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full"
                    onChange={(e) => setFirstName(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </label>
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text">Last Name</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full"
                    onChange={(e) => setLastName(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </label>
              </>
            )}
            <label className="form-control w-full my-2">
              <div className="label">
                <span className="label-text">Email ID:</span>
              </div>
              <input
                type="text"
                value={emailId}
                className="input input-bordered w-full"
                onChange={(e) => setEmailId(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </label>
            <label className="form-control w-full my-2 relative ">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type={isPasswordVisible ? "text" : "password"} // Toggle the input type
                value={password}
                className=" input input-bordered w-full"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div
                className="absolute right-2  cursor-pointer -mt-7"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle the visibility
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </div>
            </label>
          </div>
          <div className="card-actions justify-center mt-6">
            <button
              className="btn btn-primary w-full py-3"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Login" : "Sign Up"}
            </button>
          </div>
          <p
            className="mt-4 text-center cursor-pointer text-blue-500"
            onClick={() => setIsLoginForm((value) => !value)}
          >
            {isLoginForm
              ? "New User? Sign Up Here"
              : "Existing User? Login Here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
