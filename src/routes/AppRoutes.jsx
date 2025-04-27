import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Incident from "../components/dashboard/incident/incident";
import IncidentDetails from "../components/dashboard/incident/incidentDetails";
import IncidentAssignemnt from "../components/dashboard/incident/incidentAssignment";
import Settings from "../components/dashboard/settings/settings";
import ErrorPage from "../pages/ErrorPage";

import { useAuth } from "../context/authContext";

const ProtectedRoute = ({ children }) => {
  const { userLoggedIn } = useAuth();
  return userLoggedIn ? children : <Navigate to="/home" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route
            path="incident/assign/:incidentId"
            element={<IncidentAssignemnt />}
          />
          <Route path="incident" element={<Incident />} />
          <Route path="incident/:incidentId" element={<IncidentDetails />} />

          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
