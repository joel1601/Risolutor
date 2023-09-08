import React, { useEffect, useState } from "react";
import axios from "axios";

const PostsWithComments = () => {
  const [posts, setPosts] = useState([]);
  const [postComments, setPostComments] = useState({});

  useEffect(() => {
    // Fetch the list of posts
    axios.get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        const postsData = response.data;
        setPosts(postsData);

        // Fetch comments for each post
        const fetchComments = postsData.map((post) =>
          axios.get(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`)
        );

        Promise.all(fetchComments)
          .then((commentsResponses) => {
            const commentsData = commentsResponses.map((response) => response.data);
            const commentsMap = {};

            postsData.forEach((post, index) => {
              commentsMap[post.id] = commentsData[index];
            });

            setPostComments(commentsMap);
          })
          .catch((error) => {
            console.error("Error fetching comments:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
          <h3>Comments:</h3>
          <ul>
            {postComments[post.id]?.map((comment) => (
              <li key={comment.id}>
                <strong>{comment.name}</strong> ({comment.email})
                <p>{comment.body}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PostsWithComments;
