import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'; // Importing the required icons
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-white p-8 mt-10 ">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start space-y-4 md:space-y-0">
          <Link to="/" className="btn btn-ghost text-xl">
            <div className="flex items-center">
              <div className="w-6 mx-2">
                <img alt="user photo" src="/logo.png" />
              </div>
              CodeCrush
            </div>
          </Link>
        </div>

        {/* Middle Section - Contact Information */}
        <div className="flex flex-col items-center md:items-start space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-indigo-500">Contact Us</h3>
          <p className="text-sm text-gray-400">sachinsingh16404@gmail.com</p>
        </div>

        {/* Right Section - Social Media Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a
            href="https://github.com/sachinsingh45"
            aria-label="GitHub"
            className="text-gray-400 hover:text-indigo-500 transition-colors"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/sachinsingh45/"
            aria-label="LinkedIn"
            className="text-gray-400 hover:text-indigo-500 transition-colors"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://www.instagram.com/sachin_singh_ss/"
            aria-label="Instagram"
            className="text-gray-400 hover:text-indigo-500 transition-colors"
          >
            <FaInstagram size={24} />
          </a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-6 text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} CodeCrush. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
