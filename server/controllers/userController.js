import pool from "../database/db.js";

export const getUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const response = await pool.query(
      "SELECT user_id, username, email, phone FROM users WHERE user_id = $1",
      [user_id]
    );
    if (!response.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const response = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING user_id, username, email",
      [user_id]
    );

    if (!response.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: response.rows[0],
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
