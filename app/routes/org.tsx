import React, { useState } from "react";
import { Button, Table } from "@navikt/ds-react";
import { PencilIcon } from "@navikt/aksel-icons";
import LayoutTable from "~/components/layout-table";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import MeApi from "~/api/me-api";

export type OrgType = {
  org_Name: string;
  Asset_Id: string;
  org_Number: string;
};

export const loader: LoaderFunction = async () => {
  const orgs = await MeApi.fetchOrgs();
  if (!orgs) {
    throw new Response("Error fetching orgs", { status: 500 });
  }
  console.log("Fetched orgs:", orgs);
  return json(orgs);
};

export default function OrganizationTable() {
  const orgData = useLoaderData<OrgType[]>();
  const [searchItem, setSearchItem] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchItem(value);
  };

  const columns: {label: string, key: keyof OrgType}[] = [
    { label: 'Name', key: 'org_Name' },
    { label: 'Org Number', key: 'org_Number' },
    { label: 'Asset Id', key: 'Asset_Id' }
  ];

  const navigate = useNavigate();

  const renderRow = (org: OrgType, index: number) => (
    <Table.Row key={index}>
      <Table.DataCell scope="row">{org.org_Name}</Table.DataCell>
      <Table.DataCell>{org.org_Number}</Table.DataCell>
      <Table.DataCell>{org.Asset_Id}</Table.DataCell>
      <Table.DataCell>
        <Button size="xsmall" icon={<PencilIcon title="View" />} onClick={() => navigate("/orgView", { state: { org } })} />
      </Table.DataCell>
    </Table.Row>
  );

  return (
    <LayoutTable
      data={orgData}
      searchItem={searchItem}
      handleSearchChange={handleSearchChange}
      columns={columns}
      renderRow={renderRow}
      tableType="Organizations"
    />
  );
}
