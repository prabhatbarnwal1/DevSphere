import pool from "../database/db.js";

export const createUserInfo = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "INSERT INTO user_info (user_id) VALUES ($1) RETURNING *",
      [req.body.user_id]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating user info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchUserInfo = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM user_info WHERE user_id=$1",
      [req.params.user_id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "User info not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editUserInfo = async (req, res) => {
  const {
    fullname,
    about,
    github,
    portfolio,
    image_url,
    location,
    linkedin,
    skills,
    tech_stack,
    open_to_work,
  } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE user_info SET
        fullname=$1, about=$2, github=$3, portfolio=$4, image_url=$5,
        location=$6, linkedin=$7, skills=$8, tech_stack=$9, open_to_work=$10
      WHERE user_id=$11 RETURNING *`,
      [
        fullname,
        about,
        github,
        portfolio,
        image_url,
        location,
        linkedin,
        skills,
        tech_stack,
        open_to_work,
        req.params.user_id,
      ]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "User info not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
