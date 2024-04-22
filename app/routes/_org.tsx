import React, { useState } from "react";
import { Button, Table } from "@navikt/ds-react";
import { PersonIcon, PencilIcon } from "@navikt/aksel-icons";
import LayoutTable from "~/components/layout-table";

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

export default function OrganizationTable() {
  const [searchItem, setSearchItem] = useState('');
  
  const handleSearchChange = (value: string) => {
    setSearchItem(value);
  };

  const columns: {label: string, key: keyof OrgType}[] = [
    { label: 'Name', key: 'orgName' },
    { label: 'Asset Id', key: 'AssetId' },
  ];

  const renderRow = (org: OrgType, index: number) => (
    <Table.Row key={index} content="">
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