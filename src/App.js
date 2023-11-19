import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import ListGPT from "./pages/ListGPT";
import AddGPT from "./pages/AddGPT";
import EditGPT from "./pages/EditGPT";

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
          <Route
            path="/edit/:id"
            element={
              <>
                <EditGPT />
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
