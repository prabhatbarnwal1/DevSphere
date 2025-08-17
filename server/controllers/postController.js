import pool from "../database/db.js";

export const getAllPosts = async (req, res) => {
  try {
    const response = await pool.query(`
      SELECT p.*, u.username, ui.fullname, ui.image_url
      FROM posts p
      LEFT JOIN users u ON p.owner_id = u.user_id  
      LEFT JOIN user_info ui ON p.owner_id = ui.user_id
      ORDER BY p.created_at DESC, p.post_id DESC
    `);
    res.status(200).json(response.rows);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  const { title, content, collab, owner_id } = req.body;
  try {
    const response = await pool.query(
      "INSERT INTO posts (title, content, owner_id, collab) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, owner_id, collab]
    );
    res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, collab } = req.body;

  try {
    const response = await pool.query(
      "UPDATE posts SET title = $1, content = $2, collab = $3 WHERE post_id = $4 RETURNING *",
      [title, content, collab, id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await pool.query(
      "DELETE FROM posts WHERE post_id = $1 RETURNING *",
      [id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserPosts = async (req, res) => {
  const { user_id } = req.params;
  try {
    const response = await pool.query(
      "SELECT * FROM posts WHERE owner_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    res.status(200).json(response.rows);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
