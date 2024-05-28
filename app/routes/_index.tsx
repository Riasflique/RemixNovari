import type { LinksFunction, LoaderFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import React, { useState } from "react";
import { Page, TextField, Button, VStack, HStack, Heading } from "@navikt/ds-react";
import navStyles from "@navikt/ds-css/dist/index.css";
import OrganizationTable from "./org";
import PersonsTable from "./person";
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

export default function Dashboard() {
  const indexStyle = {
    margin: '0 auto',
    width: '100%',
    maxWidth: '1200px',
  };
  return (
    <div style={indexStyle}>
      <Heading size="xlarge" style={indexStyle}>Velkommen Elias Kristensen</Heading>
    </div>
  );
}
