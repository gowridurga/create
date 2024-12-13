import React, { useEffect, useRef } from "react";

const Post = ({ post }) => {
  const videoRef = useRef(null);

  // Handle autoplay when the video comes into view
  useEffect(() => {
    const handlePlay = () => {
      if (videoRef.current) {
        const rect = videoRef.current.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    };

    window.addEventListener("scroll", handlePlay);
    return () => window.removeEventListener("scroll", handlePlay);
  }, []);

  return (
    <div className="border p-4 mb-4 rounded shadow-md bg-white">
      <p className="text-lg font-semibold mb-2">{post.content}</p>
      {post.media &&
        post.media.map((url, index) =>
          url.endsWith(".mp4") ? (
            <video
              key={index}
              ref={videoRef}
              src={url}
              className="w-full rounded mb-2"
              controls
              muted
            />
          ) : (
            <img
              key={index}
              src={url}
              alt="Post media"
              className="w-full rounded mb-2"
            />
          )
        )}
      <p className="text-sm text-gray-500">
        {new Date(post.timestamp).toLocaleString()}
      </p>
    </div>
  );
};

export default Post;
