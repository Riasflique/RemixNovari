import type { LinksFunction, MetaFunction } from "@remix-run/node";
import React, { useState } from "react";
import { Page, TextField } from "@navikt/ds-react";
import navStyles from "@navikt/ds-css/dist/index.css";
import OrganizationTable from "./_org";
import PersonsTable from "./_person";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin Portal Dashboard" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: navStyles }];

export default function Dashboard() {
  const [showPersonsTable, setShowPersonsTable] = useState(false);
  const [showOrganizationsTable, setShowOrganizationsTable] = useState(false);

  const showPersons = () => {
    setShowPersonsTable(true);
    setShowOrganizationsTable(false);
  };

  const showOrganizations = () => {
    setShowPersonsTable(false);
    setShowOrganizationsTable(true);
  };

  return (
    <div>
      <button onClick={showPersons}>Personer</button>
      <button onClick={showOrganizations}>Organisasjoner</button>
      {showPersonsTable && <PersonsTable />}
      {showOrganizationsTable && <OrganizationTable />}
    </div>
  );
}