import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectLogTable from "./components/ProjectLogTable";
import EditProject from "./components/EditProject";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<ProjectLogTable />} />
      <Route path="/edit/:id" element={<EditProject />} />
    </Routes>
  </Router>
);

export default App;
