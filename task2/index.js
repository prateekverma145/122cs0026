require('dotenv').config(); 
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;
const BASE_URL = 'http://20.244.56.144/evaluation-service';
const TOKEN = process.env.API_TOKEN;

app.use(express.json());

const axiosWithAuth = axios.create({
  headers: {
    Authorization: `Bearer ${TOKEN}`
  }
});

// 1. GET /users
app.get('/users', async (req, res) => {
  try {
    const response = await axiosWithAuth.get(`${BASE_URL}/users`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// 2. GET /teams
app.get('/teams', async (req, res) => {
  try {
    const response = await axiosWithAuth.get(`${BASE_URL}/teams`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching teams:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// 3. GET /results
app.get('/results', async (req, res) => {
  try {
    const response = await axiosWithAuth.get(`${BASE_URL}/results`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching results:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// 4. GET /users/:userId/posts
app.get('/users/:userId/posts', async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await axiosWithAuth.get(`${BASE_URL}/users/${userId}/posts`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error.message);
    res.status(500).send('Internal Server Error');
  }
});

// 5. GET /posts/:postId/comments
app.get('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  try {
    const response = await axiosWithAuth.get(`${BASE_URL}/posts/${postId}/comments`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error.message);
    res.status(500).send('Internal Server Error');
  }
});

// 6. GET /users/top-commenters (Custom logic)
app.get('/users/top-commenters', async (req, res) => {
  try {
    const usersRes = await axiosWithAuth.get(`${BASE_URL}/users`);
    const users = usersRes.data.users;
    const commentCounts = {};

    for (const userId in users) {
      const postsRes = await axiosWithAuth.get(`${BASE_URL}/users/${userId}/posts`);
      const posts = postsRes.data.posts;

      for (const post of posts) {
        const commentsRes = await axiosWithAuth.get(`${BASE_URL}/posts/${post.id}/comments`);
        const comments = commentsRes.data.comments;
        commentCounts[userId] = (commentCounts[userId] || 0) + comments.length;
      }
    }

    const topUsers = Object.entries(commentCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({ id, name: users[id], commentCount: count }));

    res.json({ topUsers });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 7. GET /posts?type=popular | latest (Custom logic)
app.get('/posts', async (req, res) => {
  const { type } = req.query;
  try {
    const usersRes = await axiosWithAuth.get(`${BASE_URL}/users`);
    const users = usersRes.data.users;
    let allPosts = [];

    for (const userId in users) {
      const postsRes = await axiosWithAuth.get(`${BASE_URL}/users/${userId}/posts`);
      const posts = postsRes.data.posts;

      for (const post of posts) {
        const commentsRes = await axiosWithAuth.get(`${BASE_URL}/posts/${post.id}/comments`);
        const comments = commentsRes.data.comments;

        allPosts.push({
          id: post.id,
          content: post.content,
          userId: post.userid,
          commentCount: comments.length,
        });
      }
    }

    if (type === 'popular') {
      const maxComments = Math.max(...allPosts.map(p => p.commentCount));
      const popularPosts = allPosts.filter(p => p.commentCount === maxComments);
      return res.json({ popularPosts });
    } else {
      const latestPosts = allPosts
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);
      return res.json({ latestPosts });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
