import React from "react";

function IncidentList({ incidents }) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Assigned Incidents</h2>
      <ul>
        {incidents.map((incident, index) => (
          <li key={index} className="mb-4 p-4 border rounded-lg">
            <h3 className="font-medium">{incident.title}</h3>
            <p>{incident.description}</p>
            <p>Urgency: {incident.urgencyLevel}</p>
            <p>Assigned to: {incident.assignedOrganizations.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IncidentList;