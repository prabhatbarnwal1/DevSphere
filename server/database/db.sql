-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(10) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Posts table
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    collab BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- User Info table

CREATE TABLE user_info (
  user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  fullname TEXT,
  about TEXT,
  github TEXT,
  portfolio TEXT,
  image_url TEXT,
  location TEXT,
  linkedin TEXT,
  skills TEXT,
  tech_stack TEXT,
  open_to_work BOOLEAN DEFAULT FALSE
);


CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_posts_owner_id ON posts(owner_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);


