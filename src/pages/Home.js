import React from "react";
import Feed from "../components/Feed/Feed";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <p className="text-center mt-10">Please log in to see the feed.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {currentUser.displayName || "User"}!
      </h1>
      <Feed user={currentUser} />
    </div>
  );
};

export default Home;
