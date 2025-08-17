import { create } from "zustand";
import axios from "axios";

const URL = "http ://localhost:5000";

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
