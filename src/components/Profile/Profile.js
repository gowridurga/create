import React, { useState, useEffect, useCallback } from "react";
import { db, storage } from "../../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    profilePicture: "",
  });
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!currentUser) return;

    const profileDoc = doc(db, "users", currentUser.uid);
    const profileSnapshot = await getDoc(profileDoc);

    if (profileSnapshot.exists()) {
      setProfile(profileSnapshot.data());
    }
  }, [currentUser]);

  const handleProfileUpdate = async () => {
    if (!currentUser) return;

    try {
      const profileDoc = doc(db, "users", currentUser.uid);
      await updateDoc(profileDoc, { ...profile });
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileRef = ref(storage, `profilePictures/${currentUser.uid}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setProfile((prev) => ({ ...prev, profilePicture: url }));
    } catch (err) {
      console.error("File upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!currentUser) {
    return <p className="text-center">Please log in to view your profile.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-md bg-white">
      <div className="flex flex-col items-center">
        <div className="relative">
          {uploading ? (
            <p className="text-center text-sm">Uploading...</p>
          ) : (
            <img
              src={
                profile.profilePicture ||
                "https://via.placeholder.com/150?text=No+Image"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
          )}
          {editing && (
            <>
              <label
                htmlFor="file-upload"
                className="bg-gray-700 text-white p-1 rounded cursor-pointer"
              >
                Upload Picture
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </>
          )}
        </div>
        {editing ? (
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            placeholder="Name"
            value={profile.name}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <h2 className="text-xl font-bold">{profile.name || "No Name"}</h2>
        )}
        {editing ? (
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Bio"
            value={profile.bio}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, bio: e.target.value }))
            }
          />
        ) : (
          <p className="text-gray-600">{profile.bio || "No Bio"}</p>
        )}
      </div>
      <div className="mt-4">
        {editing ? (
          <button
            className="w-full p-2 bg-green-500 text-white rounded"
            onClick={handleProfileUpdate}
          >
            Save
          </button>
        ) : (
          <button
            className="w-full p-2 bg-blue-500 text-white rounded"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
