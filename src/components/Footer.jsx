import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa"; // Importing the required icons
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-base-100 text-base-content p-8 mt-10 border-t border-gray-300 dark:border-gray-700">
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
        <div className="flex flex-col items-center md:items-start space-y-2">
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <p className="text-sm">sachinsingh16404@gmail.com</p>
        </div>

        {/* Right Section - Social Media Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a
            href="https://github.com/sachinsingh45"
            aria-label="GitHub"
            className="hover:text-primary transition-colors"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/sachinsingh45/"
            aria-label="LinkedIn"
            className="hover:text-primary transition-colors"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://www.instagram.com/sachin_singh_ss/"
            aria-label="Instagram"
            className="hover:text-primary transition-colors"
          >
            <FaInstagram size={24} />
          </a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-6 text-sm">
        <p>&copy; {new Date().getFullYear()} CodeCrush. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
