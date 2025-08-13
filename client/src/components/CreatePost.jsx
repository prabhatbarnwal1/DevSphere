import { useState, useEffect } from "react";
import PostModal from "./PostModal";
import { useUserStore } from "../stores/userStore";
import { allPostsStore } from "../stores/postsStore";
import { Link } from "react-router-dom";

const AddPostBar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useUserStore();
  const { getPosts } = allPostsStore();

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="card p-6 animate-fade-in">
        <div className="flex items-center space-x-4">
          <Link to="/profile" className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center border-2 border-gray-600 hover:border-primary-500 transition-colors duration-200">
              <span className="text-lg font-semibold text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          </Link>
          <button
            type="button"
            className="flex-1 text-left px-6 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-full text-gray-400 hover:text-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            onClick={() => setModalOpen(true)}
          >
            What's on your mind? Share your ideas...
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Post
          </button>
        </div>
      </div>
      <PostModal open={modalOpen} setModalOpen={setModalOpen} />
    </div>
  );
};

export default AddPostBar;
