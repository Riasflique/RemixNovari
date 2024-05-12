import React, { useState } from "react";
import { Button, Table } from "@navikt/ds-react";
import { PersonIcon, PencilIcon } from "@navikt/aksel-icons";
import LayoutTable from "~/components/layout-table";
import { useNavigate } from "@remix-run/react";


export type OrgType = {
  orgName: string;
  AssetId: string;
  orgNumber: string; // Add orgNumber property
};


const orgData: OrgType[] = [
  { orgName: "Alliance to Restore the Republic", AssetId: "Rebel.Alliance", orgNumber: "123456" },
  { orgName: "Bespin Gas Mining", AssetId: "Cloud.city", orgNumber: "223344" },
  { orgName: "Corellia Shipyards", AssetId: "Corellia.shipyards", orgNumber: "334455" },
  { orgName: "Imperial Forces", AssetId: "Galactic.empire", orgNumber: "445566" },
  { orgName: "Jedi Archives", AssetId: "jedi.order", orgNumber: "556677" },
];

export default function OrganizationTable() {
  const [searchItem, setSearchItem] = useState('');
  
  const handleSearchChange = (value: string) => {
    setSearchItem(value);
  };

  const columns: {label: string, key: keyof OrgType}[] = [
    { label: 'Name', key: 'orgName' },
    { label: 'Asset Id', key: 'AssetId' },
  ];

  const navigate = useNavigate();

  const renderRow = (org: OrgType, index: number) => (
    <Table.Row key={index} content="">
      <Table.DataCell scope="row">{org.orgName}</Table.DataCell>
      <Table.DataCell>{org.AssetId}</Table.DataCell>
      <Button size="xsmall" icon={<PencilIcon title="View"/>} onClick={() => navigate("/orgView", { state: { org } })} />
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

export{orgData}