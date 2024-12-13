import React, { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

import Post from "./Post";
import PostForm from "./PostForm";

const Feed = ({ user }) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(20)
    );
    const snapshot = await getDocs(q);
    const postsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(postsData);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <PostForm userId={user?.uid} />
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
