import React, { useState } from "react";
import { db, storage } from "../../utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const PostForm = ({ userId }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("You can upload a maximum of 5 files.");
      return;
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum file size is 5MB.`);
        return;
      }
    }

    setMedia(files);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && media.length === 0) {
      alert("Please add some content or upload media.");
      return;
    }

    try {
      setUploading(true);

      const mediaUrls = [];
      for (const file of media) {
        const fileRef = ref(
          storage,
          `posts/${userId}/${Date.now()}_${file.name}`
        );
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        mediaUrls.push(url);
      }

      await addDoc(collection(db, "posts"), {
        content,
        media: mediaUrls,
        userId,
        timestamp: serverTimestamp(),
      });

      setContent("");
      setMedia([]);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white mb-4">
      <form onSubmit={handlePostSubmit}>
        <textarea
          className="w-full p-2 border rounded mb-2"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="mb-2"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
          disabled={uploading}
        >
          {uploading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
