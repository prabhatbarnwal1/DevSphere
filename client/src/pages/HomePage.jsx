import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import { allPostsStore } from "../stores/postsStore";
import { useEffect } from "react";

function HomePage() {
  const { posts, getPosts } = allPostsStore();
  useEffect(() => {
    getPosts();
  }, [getPosts]);
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to DevSphere
          </h1>
          <p className="text-xl text-primary-100 mb-8">
            Connect, collaborate, and share your development journey with fellow
            developers
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-12">
        <CreatePost />

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post.post_id} post={post} />)
          ) : (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-300">
                  No posts yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first post!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
