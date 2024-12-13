import React, { Suspense } from "react";

// Dynamically import components
const Home = React.lazy(() => import("./pages/Home"));
const ProfilePage = React.lazy(() => import("./pages/Profile"));
const Login = React.lazy(() => import("./components/Auth/Login"));
const Register = React.lazy(() => import("./components/Auth/Register"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
