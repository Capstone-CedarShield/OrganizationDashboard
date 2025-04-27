import React, { useState, useEffect } from "react";
import SidebarItem from "./sidebarItem";
import IncidentIcon from "../../../assets/icons/IncidentIcon.svg";
import DisastersIcon from "../../../assets/icons/DisasterIcon.svg";
import OrganizationIcon from "../../../assets/icons/OrganizationsIcon.svg";
import SettingsIcon from "../../../assets/icons/SettingsIcon.svg";
import CloseIcon from "../../../assets/icons/open-icon.svg";
import OpenIcon from "../../../assets/icons/open-icon.svg";
import LogoutIcon from "../../../assets/icons/logout-icon.svg";
import { logout } from "../../../firebase/auth";
import { useAuth } from "../../../context/authContext";
import RedCrossIcon from "../../../assets/icons/redCross-icon.svg";
import CivilDefenseIcon from "../../../assets/icons/org2.svg";
import InternalSecurityIcon from "../../../assets/icons/org3.svg";

// Organization mapping
const organizationInfo = [
  {
    email: "redcross@gmail.com",
    name: "Lebanese Red Cross",
    image: RedCrossIcon,
  },
  {
    email: "civildefense@gmail.com",
    name: "Civil Defense",
    image: CivilDefenseIcon,
  },
  {
    email: "internalsecurity@gmail.com",
    name: "Internal Security",
    image: InternalSecurityIcon,
  },
];

const routes = [
  { path: "incident", name: "Incidents", icon: IncidentIcon },
  { path: "settings", name: "Settings", icon: SettingsIcon },
];

const organizationRoutes = [
  {
    path: "organizationincident",
    name: "OrganizationIncidents",
    icon: OrganizationIcon,
  },
  {
    path: "organizationsettings",
    name: "OrganizationSettings",
    icon: SettingsIcon,
  },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [activePath, setActivePath] = useState(routes[0].path);
  const { role } = useAuth();
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const displayRoutes = role === "organization" ? organizationRoutes : routes;

  // Match current user to organization info
  const currentOrg = organizationInfo.find((org) => org.email === user?.email);
  const orgImage = currentOrg?.image || "/assets/icons/default-avatar.svg";
  const orgName = currentOrg?.name || user?.email?.split("@")[0];

  return (
    <div
      className={`h-screen flex flex-col justify-between transition-all duration-300 ${
        isOpen ? "w-64 md:w-80" : "w-16"
      } bg-transparent`}
      style={{
        borderRight: "1px solid rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(20px) brightness(1.2)",
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(139, 0, 0, 0.15) 10%, rgba(255, 255, 255, 0.5) 50%), radial-gradient(circle at 80% 70%, rgba(139, 0, 0, 0.1) 15%, rgba(255, 255, 255, 0.5) 40%)`,
      }}
    >
      <div>
        <div className={`flex justify-end p-4 ${isOpen ? "" : "bg-transparent"}`}>
          <button
            onClick={toggleSidebar}
            className="text-black text-2xl focus:outline-none"
            style={{ background: "none", border: "none" }}
          >
            {isOpen ? (
              <img src={CloseIcon} alt="Close Sidebar" className="h-6 w-6" />
            ) : (
              <img src={OpenIcon} alt="Open Sidebar" className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* User Info Section */}
        {isOpen && (
          <div className="flex items-center mb-8 px-6">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-300">
              <img src={orgImage} alt="User Icon" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xl font-semibold text-black">{orgName}</p>
              <p className="text-sm text-gray-500">
                {role === "organization" ? "Member" : "Employee"}
              </p>
            </div>
          </div>
        )}

        {/* Sidebar Menu */}
        <div className={`flex flex-col px-2 md:px-6 ${isOpen ? "" : "hidden"}`}>
          {displayRoutes.map((route, index) => (
            <SidebarItem
              key={index}
              route={route}
              isActive={activePath === route.path}
              onClick={() => setActivePath(route.path)}
            />
          ))}
        </div>
      </div>

      {/* Logout Button */}
      {isOpen && (
        <div className="px-6 pb-6">
          <button
            onClick={logout}
            className="flex items-center w-full text-black text-base font-medium hover:bg-gray-100 p-4 rounded-lg transition-all duration-200"
          >
            <img src={LogoutIcon} alt="Logout Icon" className="h-5 w-5 mr-3" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
