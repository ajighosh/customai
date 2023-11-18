import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

import Landing from "./pages/Landing";
import ListGPT from "./pages/ListGPT";
import AddGPT from "./pages/AddGPT";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Landing />
              </>
            }
          />
          <Route
            path="/list"
            element={
              <>
                <ListGPT />
              </>
            }
          />
          <Route
            path="/add"
            element={
              <>
                <AddGPT />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
