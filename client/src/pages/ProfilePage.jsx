import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import axios from "axios";
import ProfileCard from "../components/ProfileCard";

const URL = "https://devsphere-server-srn8.onrender.com";

function ProfilePage() {
  const { id } = useParams();
  const { user: loggedInUser } = useUserStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = !id || String(loggedInUser.user_id) === String(id);
  const userIdToFetch = id || loggedInUser.user_id;

  const fetchUser = async () => {
    if (!userIdToFetch) {
      setError("User not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userResponse = await axios.get(`${URL}/api/users/${userIdToFetch}`);

      const userInfoResponse = await axios.get(
        `${URL}/api/user-info/${userIdToFetch}`
      );

      const mergedUser = {
        ...userResponse.data,
        ...userInfoResponse.data,
        techstack: userInfoResponse.data.tech_stack,
      };

      setUser(mergedUser);
    } catch (err) {
      const errorMessage =
        err.response?.status === 404
          ? "User not found"
          : "Failed to load user profile";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedData) => {
    if (updatedData) {
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedData,
        techstack: updatedData.tech_stack,
      }));
    } else {
      fetchUser();
    }
  };

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }
    fetchUser();
  }, [userIdToFetch, loggedInUser]);

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger text-center">
          <h4>{error}</h4>
          <button className="btn btn-primary mt-2" onClick={fetchUser}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <ProfileCard
        user={user}
        editable={isOwnProfile}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
}

export default ProfilePage;
