import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import { allPostsStore } from "../stores/postsStore";

const URL = "https://devsphere-server-srn8.onrender.com";

const getOwnerInfo = async (owner_id) => {
  const response = await axios.get(`${URL}/api/users/${owner_id}`);
  return response.data;
};

function Post({ post }) {
  const { post_id, title, content, created_at, owner_id, collab } = post;
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState({
    title: title || "",
    content: content || "",
    collab: collab || false,
  });

  const { user: currentUser } = useUserStore();
  const { updatePost, deletePost } = allPostsStore();

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      try {
        const data = await getOwnerInfo(owner_id);
        setOwnerInfo(data);
      } catch (error) {
        // handle error or ignore
      }
    };
    fetchOwnerInfo();
  }, [owner_id]);

  // Reset edit data when post changes
  useEffect(() => {
    setEditData({
      title: title || "",
      content: content || "",
      collab: collab || false,
    });
  }, [title, content, collab]);

  const username = ownerInfo ? ownerInfo.username : "Username";
  const formattedDate = created_at?.split("T")[0] ?? "";
  const isOwnPost = currentUser?.user_id === owner_id;

  const handleEdit = async () => {
    if (!editData.title.trim() || !editData.content.trim()) {
      alert("Title and content are required");
      return;
    }

    try {
      const response = await axios.patch(`${URL}/api/posts/${post_id}`, {
        title: editData.title,
        content: editData.content,
        collab: editData.collab,
        owner_id: currentUser.user_id,
      });

      if (response.status === 200) {
        updatePost(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axios.delete(`${URL}/api/posts/${post_id}`);

      if (response.status === 200) {
        deletePost(post_id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      title: title || "",
      content: content || "",
      collab: collab || false,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div className="card p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 animate-fade-in">
        {/* Post Header */}
        <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6 flex-col sm:flex-row gap-4 sm:gap-0">
          <div className="flex items-center space-x-4">
            <Link to={`/profile/${owner_id}`} className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500 rounded-full flex items-center justify-center border-2 border-gray-600 hover:border-primary-500 transition-colors duration-200">
                <span className="text-base sm:text-lg font-semibold text-white">
                  {username?.charAt(0).toUpperCase()}
                </span>
              </div>
            </Link>
            <div>
              <Link
                to={`/profile/${owner_id}`}
                className="font-semibold text-white hover:text-primary-400 transition-colors duration-200 text-sm sm:text-base"
              >
                {username}
              </Link>
              <p className="text-gray-400 text-xs sm:text-sm">
                {formattedDate}
              </p>
            </div>
          </div>

          {collab && !isEditing && (
            <div className="flex items-center space-x-2 bg-green-900 text-green-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span className="hidden sm:inline">
                Looking for Collaborators
              </span>
              <span className="sm:hidden">Collab</span>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div>
          {isEditing ? (
            // Edit Mode
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  className="input-field resize-none"
                  rows="6"
                  value={editData.content}
                  onChange={(e) =>
                    setEditData({ ...editData, content: e.target.value })
                  }
                  placeholder="Post content"
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 bg-gray-600 border-gray-500 rounded focus:ring-primary-500 focus:ring-2"
                  id={`collab-${post_id}`}
                  checked={editData.collab}
                  onChange={(e) =>
                    setEditData({ ...editData, collab: e.target.checked })
                  }
                />
                <label
                  className="text-gray-300 font-medium"
                  htmlFor={`collab-${post_id}`}
                >
                  Looking for Collaborators
                </label>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="button"
                  className="btn-success w-full sm:w-auto"
                  onClick={handleEdit}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn-secondary w-full sm:w-auto"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Display Mode
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                {title}
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 whitespace-pre-wrap text-sm sm:text-base">
                {content}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-700">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {isOwnPost ? (
                    // Show Edit/Delete for own posts
                    <>
                      <button
                        type="button"
                        className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors duration-200"
                        onClick={() => setIsEditing(true)}
                      >
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                      </button>
                    </>
                  ) : (
                    // Show Collaborate link for others' posts
                    collab && (
                      <Link
                        to={`/profile/${owner_id}`}
                        className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors duration-200 font-medium"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Collaborate</span>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
