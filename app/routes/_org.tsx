import { SetStateAction, useState } from "react";
import "./style.css";
import { Link } from "@remix-run/react";
import { Button, HStack, Table, Search } from "@navikt/ds-react";
import { PersonIcon, PencilIcon} from '@navikt/aksel-icons';


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
    const [organizations, setOrganizations] = useState(orgData);
    const [searchItem, setSearchItem] = useState ('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingPerson, setIsEditingPerson] = useState<OrgType |null>(null);

    const handleSearchChange = (value: string) => {
      setSearchItem(value);
    };

  const filteredOrgs = organizations.filter(organizations =>
    organizations.orgName.toLowerCase().includes(searchItem.toLowerCase()) || 
    organizations.AssetId.toLowerCase().includes(searchItem.toLowerCase()));
    return(
<div>
        <form data-theme="dark" role="search">
        <Button icon={<PersonIcon aria-hidden />}>Add new</Button>
        <Search
        label= "Søk"
        placeholder="Søk etter organisasjon"
        variant="simple"
        htmlSize="16"
        onChange={handleSearchChange}
        value={searchItem}/>

        </form>
      <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
          <Table.HeaderCell scope="col">Asset Id</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {filteredOrgs.map(({ orgName, AssetId }, i) => {
          return (
            <Table.Row
              key={i + orgName}
              content=""
            >
              <Table.DataCell scope="row">{orgName}</Table.DataCell>
              <Table.DataCell>{AssetId}</Table.DataCell>
              <Button size="xsmall" icon={<PencilIcon title="Rediger" />} />
              
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
    </div>
    );
  };
  
  export {orgData};