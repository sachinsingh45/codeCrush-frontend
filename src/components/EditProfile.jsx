import { useState, useRef } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const EditProfile = ({ user, onClose }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [linkedin, setLinkedin] = useState(user.linkedin || "");
  const [github, setGithub] = useState(user.github || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const previewRef = useRef(null); // Create reference for the preview card section

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        { firstName, lastName, photoUrl, age, gender, about, skills, linkedin, github },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      if (onClose) onClose();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // Scroll to the preview section when clicked
  const scrollToPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="card bg-base-300 w-full shadow-xl p-2 sm:p-2">
        <div className="space-y-2">
          {/* First Name Input */}
          <div className="form-group">
            <label htmlFor="firstName" className="text-xs font-medium text-gray-600">First Name</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              className="input input-bordered input-sm w-full"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* Last Name Input */}
          <div className="form-group">
            <label htmlFor="lastName" className="text-xs font-medium text-gray-600">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              className="input input-bordered input-sm w-full"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* Photo URL Input */}
          <div className="form-group">
            <label htmlFor="photoUrl" className="text-xs font-medium text-gray-600">Photo URL</label>
            <input
              id="photoUrl"
              type="text"
              value={photoUrl}
              className="input input-bordered input-sm w-full"
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>

          {/* Age Input */}
          <div className="form-group">
            <label htmlFor="age" className="text-xs font-medium text-gray-600">Age</label>
            <input
              id="age"
              type="number"
              value={age}
              className="input input-bordered input-sm w-full"
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          {/* Gender Input */}
          <div className="form-group">
            <label htmlFor="gender" className="text-xs font-medium text-gray-600">Gender</label>
            <select
              id="gender"
              className="select select-bordered select-sm w-full"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* About Textarea */}
          <div className="form-group">
            <label htmlFor="about" className="text-xs font-medium text-gray-600">About Yourself</label>
            <textarea
              id="about"
              value={about}
              className="textarea textarea-bordered textarea-sm w-full"
              onChange={(e) => setAbout(e.target.value)}
              rows={2}
            ></textarea>
          </div>

          {/* Social Links Grouped */}
          <div className="form-group flex flex-col gap-2 mt-2">
            <label className="text-xs font-medium text-gray-600 mb-1">Social Links</label>
            <div className="flex gap-2 w-full">
              <div className="flex-1 flex items-center gap-2">
                <FaLinkedin className="text-blue-600 text-lg" />
                <input
                  id="linkedin"
                  type="text"
                  value={linkedin}
                  className="input input-bordered input-sm w-full"
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="LinkedIn URL"
                />
              </div>
              <div className="flex-1 flex items-center gap-2">
                <FaGithub className="text-gray-800 text-lg" />
                <input
                  id="github"
                  type="text"
                  value={github}
                  className="input input-bordered input-sm w-full"
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="GitHub URL"
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Skills</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a skill..."
                value={newSkill}
                className="input input-bordered input-sm w-full"
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <button
                className="btn btn-secondary btn-sm px-3 py-1"
                onClick={handleAddSkill}
              >
                Add
              </button>
            </div>

            {/* Display Skills */}
            <div className="flex flex-wrap gap-1 mt-1">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="badge badge-primary px-2 py-1 flex items-center gap-1 cursor-pointer text-xs"
                  onClick={() => handleRemoveSkill(skill)}
                >
                  {skill}
                  <span className="text-xs ml-1 text-white">✕</span>
                </span>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2 w-full justify-end mt-2">
            <button className="btn btn-sm bg-amber-600 text-white" onClick={saveProfile}>
              Save
            </button>
            <button className="btn btn-sm btn-secondary" onClick={() => { setShowToast('cancel'); handleCancel(); }}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      {showToast === true && (
        <div className="toast toast-bottom toast-center transition-opacity duration-300 ease-in">
          <div className="alert alert-success">
            <span>Profile updated successfully!</span>
          </div>
        </div>
      )}
      {showToast === 'cancel' && (
        <div className="toast toast-bottom toast-center transition-opacity duration-300 ease-in">
          <div className="alert alert-warning">
            <span>Profile edit cancelled.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
