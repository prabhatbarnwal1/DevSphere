import { useForm } from "react-hook-form";
import axios from "axios";
import { useUserStore } from "../stores/userStore";
import { allPostsStore } from "../stores/postsStore";

const URL = "https://devsphere-server-srn8.onrender.com";

const PostModal = ({ open, setModalOpen }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const { user } = useUserStore();
  if (!open) return null;

  function onClose() {
    setModalOpen(false);
    reset();
  }

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${URL}/api/posts`, {
        ...data,
        owner_id: user.user_id,
      });
      if (response.status === 201) {
        const { addPost } = allPostsStore.getState();
        addPost(response.data);
      }
      onClose();
    } catch (error) {
      console.error("Error posting post:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-10"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Create a Post</h2>
            <button
              type="button"
              className="text-gray-400 hover:text-white transition-colors duration-200 hover:bg-gray-700 rounded-lg"
              onClick={onClose}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div>
              <input
                {...register("title", { required: "Title is required" })}
                type="text"
                className="input-field"
                placeholder="Give your post a catchy title..."
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <textarea
                {...register("content", { required: "Content is required" })}
                className="input-field resize-none"
                placeholder="Share your thoughts, ideas, or ask for help..."
                rows={2}
              />
              {errors.content && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
              <input
                {...register("collab")}
                type="checkbox"
                id="collab"
                className="w-4 h-4 text-primary-600 bg-gray-600 border-gray-500 rounded focus:ring-primary-500 focus:ring-2"
              />
              <label htmlFor="collab" className="text-gray-300 font-medium">
                Looking for collaborators?
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
                  Collaboration
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-8 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
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
                  <span>Posting...</span>
                </div>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
