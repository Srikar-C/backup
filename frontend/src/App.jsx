import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Components/Landing/Landing";
import Login from "./Components/Users/Login";
import Navigation from "./Components/Landing/Navigation";
import Register from "./Components/Users/Register";
import Forgot from "./Components/Users/Forgot";
import Password from "./Components/Users/Passwords";
import Dashboard from "./Components/Dashboard";
import Verify from "./Components/Users/Verify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/changepassword" element={<Password />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
