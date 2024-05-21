import React, { useState } from "react";
import { Button, Table } from "@navikt/ds-react";
import { PencilIcon } from "@navikt/aksel-icons";
import LayoutTable from "~/components/layout-table";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import MeApi from "~/api/me-api";

export type OrgType = {
  orgname: string;
  assetid: string;
  orgnumber: string;
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
    { label: 'Name', key: 'orgname' },
    { label: 'Org Number', key: 'orgnumber' },
    { label: 'Asset Id', key: 'assetid' }
  ];

  const navigate = useNavigate();

  const renderRow = (org: OrgType, index: number) => (
    <Table.Row key={index}>
      <Table.DataCell scope="row">{org.orgname}</Table.DataCell>
      <Table.DataCell>{org.orgnumber}</Table.DataCell>
      <Table.DataCell>{org.assetid}</Table.DataCell>
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
