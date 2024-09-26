import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Components/Landing/Landing";
import Login from "./Components/Users/Login";
import Register from "./Components/Users/Register";
import Forgot from "./Components/Users/Forgot";
import Password from "./Components/Users/Passwords";
import Dashboard from "./Components/Dashboard";
import VerifyPass from "./Components/Users/VerifyPass";
import VerifyAccount from "./Components/Users/VerifyAccount";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/verifypass" element={<VerifyPass />} />
        <Route path="/verifyacc" element={<VerifyAccount />} />
        <Route path="/changepassword" element={<Password />} />
        <Route path="/:username" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
