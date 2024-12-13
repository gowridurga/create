import React from "react";
import Profile from "../components/Profile/Profile";
import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <p className="text-center mt-10">Please log in to view your profile.</p>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <Profile />
    </div>
  );
};

export default ProfilePage;
