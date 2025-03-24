import { useState, useRef } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const previewRef = useRef(null); // Create reference for the preview card section

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        { firstName, lastName, photoUrl, age, gender, about, skills },
        { withCredentials: false }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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

  return (
    <div className="flex flex-col items-center my-10">
      <div className="card bg-base-300 w-96 shadow-xl p-6">
        <h2 className="text-xl font-bold text-center mb-4">Edit Profile</h2>
        <div className="space-y-3">
          {/* First Name Input */}
          <div className="form-group">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-600">First Name</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              className="input input-bordered w-full"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* Last Name Input */}
          <div className="form-group">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-600">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              className="input input-bordered w-full"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* Photo URL Input */}
          <div className="form-group">
            <label htmlFor="photoUrl" className="text-sm font-medium text-gray-600">Photo URL</label>
            <input
              id="photoUrl"
              type="text"
              value={photoUrl}
              className="input input-bordered w-full"
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>

          {/* Age Input */}
          <div className="form-group">
            <label htmlFor="age" className="text-sm font-medium text-gray-600">Age</label>
            <input
              id="age"
              type="number"
              value={age}
              className="input input-bordered w-full"
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          {/* Gender Input */}
          <div className="form-group">
            <label htmlFor="gender" className="text-sm font-medium text-gray-600">Gender</label>
            <select
              id="gender"
              className="select select-bordered w-full"
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
            <label htmlFor="about" className="text-sm font-medium text-gray-600">About Yourself</label>
            <textarea
              id="about"
              value={about}
              className="textarea textarea-bordered w-full"
              onChange={(e) => setAbout(e.target.value)}
            ></textarea>
          </div>

          {/* Skills Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">Skills</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a skill..."
                value={newSkill}
                className="input input-bordered w-full"
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <button
                className="btn btn-primary px-4 py-2"
                onClick={handleAddSkill}
              >
                Add
              </button>
            </div>

            {/* Display Skills */}
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="badge badge-primary px-3 py-1 flex items-center gap-1 cursor-pointer"
                  onClick={() => handleRemoveSkill(skill)}
                >
                  {skill}
                  <span className="text-xs ml-1 text-white">✕</span>
                </span>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-4 w-full">
            <button className="btn bg-amber-600 w-50" onClick={saveProfile}>
              Save Profile
            </button>
            <button className="btn btn-secondary w-auto" onClick={scrollToPreview}>
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div ref={previewRef} className="mt-8">
        <UserCard user={{ firstName, lastName, photoUrl, age, gender, about, skills }} />
      </div>

      {showToast && (
        <div className="toast toast-top toast-center transition-opacity duration-300 ease-in">
          <div className="alert alert-success">
            <span>Profile updated successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
