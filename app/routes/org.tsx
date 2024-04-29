import React, { useState } from "react";
import { Button, Table } from "@navikt/ds-react";
import { PersonIcon, PencilIcon } from "@navikt/aksel-icons";
import LayoutTable from "~/components/layout-table";
import { LoaderFunction, json } from "@remix-run/node";
import path from 'path';
import fs from 'fs/promises';
import { useLoaderData } from "@remix-run/react";

export type OrgType = {
  orgName: string;
  AssetId: string;
};

const orgData: OrgType[] = [
  { orgName: "Alliance to Restore the Republic", AssetId: "Rebel.Alliance" },
  { orgName: "Bespin Gas Mining", AssetId: "Cloud.city" },
  { orgName: "Corellia Shipyards", AssetId: "Corellia.shipyards" },
  { orgName: "Imperial Forces", AssetId: "Galactic.empire" },
  { orgName: "Jedi Archives", AssetId: "jedi.order" },
];


export const loader: LoaderFunction = async () => {
  const filePath = path.join(process.cwd(), 'app', 'data', 'orgData.json');
  const data = await fs.readFile(filePath, 'utf8');
  const jsonData = JSON.parse(data);
  console.log("Parsed data:", jsonData);  // This should log the array of objects
  return json(jsonData);
};


export default function OrganizationTable() {
  const orgData = useLoaderData<OrgType[]>();
  console.log("orgData from loader:", orgData)
  const [searchItem, setSearchItem] = React.useState('');

  const handleSearchChange = (value: string) => {
    setSearchItem(value);
  };

  const columns: {label: string, key: keyof OrgType}[] = [
    { label: 'Name', key: 'orgName' },
    { label: 'Asset Id', key: 'AssetId' },
  ];

  const renderRow = (org: OrgType, index: number) => (
    <Table.Row key={index}>
      <Table.DataCell scope="row">{org.orgName}</Table.DataCell>
      <Table.DataCell>{org.AssetId}</Table.DataCell>
      <Button size="xsmall" icon={<PencilIcon title="Rediger"/>} />
    </Table.Row>
  );

  return (
    <LayoutTable
      data={orgData}
      searchItem={searchItem}
      handleSearchChange={handleSearchChange}
      columns={columns}
      renderRow={renderRow}
    />
  );
}

  
  export {orgData};