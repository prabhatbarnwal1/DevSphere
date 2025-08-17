import { create } from "zustand";
import axios from "axios";

<<<<<<< HEAD
const URL = "http ://localhost:5000";
=======
const URL = "https://devsphere-server-srn8.onrender.com";
>>>>>>> 83aa994d76d98c5a0da4f77c5cea8d37e013ddc7

export const userPostsStore = create((set) => ({
  userPosts: [],
  setUserPosts: (userPosts) => set({ userPosts }),
}));

export const allPostsStore = create((set, get) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),

  getPosts: async () => {
    const response = await axios.get(`${URL}/api/posts`);
<<<<<<< HEAD
    // Ensure posts is always an array
    set({ posts: Array.isArray(response.data) ? response.data : [] });
=======
    set({ posts: response.data });
>>>>>>> 83aa994d76d98c5a0da4f77c5cea8d37e013ddc7
  },

  addPost: async (post) => set({ posts: [post, ...get().posts] }),

  updatePost: (updatedPost) => {
    const posts = get().posts;
    const updatedPosts = posts.map((post) =>
      post.post_id === updatedPost.post_id ? updatedPost : post
    );
    set({ posts: updatedPosts });
  },

  deletePost: (postId) => {
    const posts = get().posts;
    const filteredPosts = posts.filter((post) => post.post_id !== postId);
    set({ posts: filteredPosts });
  },
}));
