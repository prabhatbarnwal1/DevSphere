import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserStore } from "../stores/userStore";

const URL = "https://devsphere-server-srn8.onrender.com";

function ProfileCard({ user, editable = false, onProfileUpdate }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", msg: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const { user: currentUser, setUser, hardReset } = useUserStore();
  const navigate = useNavigate();

  const {
    user_id,
    username = "",
    email = "",
    phone = "",
    fullname = "",
    location = "",
    about = "",
    github = "",
    portfolio = "",
    linkedin = "",
    skills = "",
    techstack = "",
    open_to_work: openToWork = false,
  } = user ?? {};

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();

  useEffect(() => {
    reset({
      fullname,
      location,
      about,
      github,
      portfolio,
      linkedin,
      skills,
      techstack,
      openToWork,
    });
  }, [
    reset,
    fullname,
    location,
    about,
    github,
    portfolio,
    linkedin,
    skills,
    techstack,
    openToWork,
  ]);

  const urlRule = (rx) => (v) => !v || rx.test(v) || "Invalid URL";

  const onSubmit = async (data) => {
    const payload = {
      fullname: data.fullname || null,
      location: data.location || null,
      about: data.about || null,
      github: data.github || null,
      portfolio: data.portfolio || null,
      linkedin: data.linkedin || null,
      skills: data.skills || null,
      tech_stack: data.techstack || null,
      open_to_work: data.openToWork ?? false,
      image_url: null,
    };

    try {
      const res = await axios.put(`${URL}/api/user-info/${user_id}`, payload);

      if (currentUser?.user_id === user_id) {
        setUser({ ...currentUser, ...payload, techstack: payload.tech_stack });
      }

      setFeedback({ type: "success", msg: "Profile updated successfully!" });
      setIsEditMode(false);
      onProfileUpdate?.(res.data);
    } catch (err) {
      setFeedback({
        type: "danger",
        msg: err.response?.data?.error || "Update failed, please retry.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      sessionStorage.setItem("logging-out", "true");
      await axios.post(`${URL}/api/auth/logout`);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      hardReset();
      navigate("/login", { replace: true });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmMessage = `Are you sure you want to delete your account? This action cannot be undone.
    
Type "DELETE" to confirm:`;

    const userConfirmation = prompt(confirmMessage);

    if (userConfirmation !== "DELETE") {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axios.delete(`${URL}/api/users/${user_id}`);

      if (response.status === 200) {
        hardReset();
        alert("Your account has been successfully deleted.");
        navigate("/signup");
      }
    } catch (err) {
      setFeedback({
        type: "danger",
        msg:
          err.response?.data?.error ||
          "Failed to delete account. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const InfoField = ({ label, value, icon }) => (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-2">
        {icon}
        <label className="text-sm font-medium text-gray-300">{label}</label>
      </div>
      <p className="text-white">{value || "Not specified"}</p>
    </div>
  );

  const EditField = ({
    name,
    label,
    placeholder,
    type = "text",
    validation = {},
    icon,
  }) => (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        {icon}
        <label className="text-sm font-medium text-gray-300">{label}</label>
      </div>
      {type === "textarea" ? (
        <textarea
          className="input-field resize-none"
          rows="4"
          placeholder={placeholder}
          {...register(name, validation)}
        />
      ) : (
        <input
          type={type}
          className="input-field"
          placeholder={placeholder}
          {...register(name, validation)}
        />
      )}
      {errors[name] && (
        <p className="text-red-400 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-primary-600">
                {username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {fullname || username}
              </h1>
              <p className="text-primary-100 text-lg">@{username}</p>
              {openToWork && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Open to Work
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {feedback.msg && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                feedback.type === "success"
                  ? "bg-green-900 text-green-300 border border-green-700"
                  : "bg-red-900 text-red-300 border border-red-700"
              }`}
            >
              {feedback.msg}
            </div>
          )}

          {!isEditMode ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Email"
                  value={email}
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  }
                />
                <InfoField
                  label="Phone"
                  value={phone}
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  }
                />
                <InfoField
                  label="Location"
                  value={location}
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
                <InfoField
                  label="Skills"
                  value={skills}
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>

              {/* About */}
              {about && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <label className="text-sm font-medium text-gray-300">
                      About
                    </label>
                  </div>
                  <p className="text-white whitespace-pre-wrap">{about}</p>
                </div>
              )}

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-white font-medium">GitHub</span>
                  </a>
                )}
                {portfolio && (
                  <a
                    href={portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-white font-medium">Portfolio</span>
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-white font-medium">LinkedIn</span>
                  </a>
                )}
              </div>

              {/* Tech Stack */}
              {techstack && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 7H7v6h6V7z" />
                      <path
                        fillRule="evenodd"
                        d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5v10h10V5H5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <label className="text-sm font-medium text-gray-300">
                      Tech Stack
                    </label>
                  </div>
                  <p className="text-white">{techstack}</p>
                </div>
              )}

              {editable && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 pt-6 border-t border-gray-700">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => {
                        reset({
                          fullname,
                          location,
                          about,
                          github,
                          portfolio,
                          linkedin,
                          skills,
                          techstack,
                          openToWork,
                        });
                        setIsEditMode(true);
                        setFeedback({ type: "", msg: "" });
                      }}
                    >
                      Edit Profile
                    </button>
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn-danger"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting Account..." : "Delete Account"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditField
                  name="fullname"
                  label="Full Name"
                  placeholder="Enter your full name"
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
                <EditField
                  name="location"
                  label="Location"
                  placeholder="City, Country"
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>

              <EditField
                name="about"
                label="About"
                placeholder="Tell us about yourself..."
                type="textarea"
                icon={
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditField
                  name="github"
                  label="GitHub URL"
                  placeholder="https://github.com/username"
                  validation={{
                    validate: urlRule(
                      /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/?$/
                    ),
                  }}
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
                <EditField
                  name="portfolio"
                  label="Portfolio URL"
                  placeholder="https://yourportfolio.com"
                  validation={{
                    validate: urlRule(/^https?:\/\//),
                  }}
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditField
                  name="linkedin"
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/in/username"
                  validation={{
                    validate: urlRule(
                      /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w.-]+\/?$/
                    ),
                  }}
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
                <EditField
                  name="skills"
                  label="Skills"
                  placeholder="JavaScript, React, Node.js"
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>

              <EditField
                name="techstack"
                label="Tech Stack"
                placeholder="React, Node.js, MongoDB, AWS"
                icon={
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 7H7v6h6V7z" />
                    <path
                      fillRule="evenodd"
                      d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5v10h10V5H5z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />

              {/* Open to work checkbox */}
              <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
                <input
                  type="checkbox"
                  id="openToWork"
                  className="w-4 h-4 text-primary-600 bg-gray-600 border-gray-500 rounded focus:ring-primary-500 focus:ring-2"
                  {...register("openToWork")}
                />
                <label
                  htmlFor="openToWork"
                  className="text-gray-300 font-medium"
                >
                  Open to Work
                </label>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Available
                  </span>
                </div>
              </div>

              <div className="flex space-x-4 pt-6 border-t border-gray-700">
                <button
                  type="submit"
                  className="btn-success flex items-center space-x-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    reset();
                    setIsEditMode(false);
                    setFeedback({ type: "", msg: "" });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
