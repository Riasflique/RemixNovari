import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import React, { useState } from "react";
import { Page, TextField, Button, VStack, HStack } from "@navikt/ds-react";
import navStyles from "@navikt/ds-css/dist/index.css";
import OrganizationTable from "./_org";
import PersonsTable from "./_person";
import "./style.css";
import { Link, json } from "@remix-run/react";
import MeApi from "~/api/me-api";
import { useLoaderData } from "@remix-run/react";


export const meta: MetaFunction = () => {
  return [
    { title: "Admin Portal Dashboard" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: navStyles }];

//export async function loader({request}: LoaderFunctionArgs) {
//  return json(await fetchDisplayName());
  
 // }
 export const loader = ({ request }) => {
  return json(MeApi.fetchDisplayName());
}

export default function Dashboard() {
  const [showPersonsTable, setShowPersonsTable] = useState(false);
  const [showOrganizationsTable, setShowOrganizationsTable] = useState(false);
  const loaderData = useLoaderData();

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
      <VStack align={"center"}> 
      <HStack gap="2">
        <p id="test">felles</p>
      <Button variant="primary-neutral" onClick={MeApi.test}>Personer</Button>
      <Button variant="primary-neutral" onClick={showOrganizations}>Organisasjoner</Button>
      </HStack>
      </VStack>
      {showPersonsTable && <PersonsTable />}
      {showOrganizationsTable && <OrganizationTable />}
    </div>
  );
}