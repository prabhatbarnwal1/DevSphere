import { create } from "zustand";
import axios from "axios";

const URL = "http://localhost:5000";

export const userPostsStore = create((set) => ({
  userPosts: [],
  setUserPosts: (userPosts) => set({ userPosts }),
}));

export const allPostsStore = create((set, get) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),

  getPosts: async () => {
    const response = await axios.get(`${URL}/api/posts`);
    // Ensure posts is always an array
    set({ posts: Array.isArray(response.data) ? response.data : [] });
  },

  addPost: async (post) => {
    try {
      const response = await axios.post(`${URL}/api/posts`, post);
      // Optionally, use response.data if backend returns the created post
      await get().getPosts(); // Refresh posts from backend
    } catch (error) {
      console.error("Error adding post:", error);
    }
  },

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
