import React, { useState } from 'react';
import { useLocation } from '@remix-run/react';
import { Tabs, Heading, TextField, Button , VStack} from "@navikt/ds-react";
import { PersonGroupIcon, ComponentIcon, PencilIcon, Buildings3Icon} from '@navikt/aksel-icons';
import { ATextDefault } from '@navikt/ds-tokens/dist/tokens';

export default function OrgView() {
  const location = useLocation();
  const { org } = location.state;
  const [selectedTab, setSelectedTab] = useState("contacts");
  const [orgName, setOrgName] = useState(org.orgName); 
  const [orgNumber, setOrgNumber] = useState(org.orgNumber);
  const [editedOrgName, setEditedOrgName] = useState(org.orgName); 
  const [editedOrgNumber, setEditedOrgNumber] = useState(org.orgNumber); 
  const [contactsCount, setContactsCount] = useState(0);
  const [componentCount, setcomponentCount] = useState(0);

  const handleTabChange = (tabValue: string) => {
    setSelectedTab(tabValue);
  };

  const handleOrgNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedOrgName(event.target.value);
  };

  const handleOrgNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedOrgNumber(event.target.value);
  };

  const handleSave = () => {
    const updatedOrg = {
      ...org,
      orgName: editedOrgName,
      orgNumber: editedOrgNumber
    };
    console.log("oppdatert: ", updatedOrg); //alt skjer lokalt nå, så er bare en random console log for å se at ting funkærrr + ny value


    setOrgName(editedOrgName);
    setOrgNumber(editedOrgNumber);
  };

  const ViewOrgStyle = {
    margin: '0 auto',
    width: '69%',
    maxWidth: '1200px',
  };

  return (
    <div style={ViewOrgStyle}>
      <Heading size='xlarge' icon={<Buildings3Icon aria-hidden />}>Organizations</Heading>
      <div>
        <h3>{orgName}</h3>
        <p>Org number: {orgNumber}</p>
        <p>Primary Asset Id: {org.AssetId}</p>
        <div className='Tabs'>
          <Tabs defaultValue="contacts" onChange={handleTabChange}>
            <Tabs.List>
             <Tabs.Tab icon={<PersonGroupIcon aria-hidden />} value="contacts" label={`Contacts (${contactsCount})`} />
              <Tabs.Tab icon={<ComponentIcon aria-hidden />} value="components" label={`Components (${contactsCount})`} />
              <Tabs.Tab icon={<PencilIcon aria-hidden />} value="editOrg" label="Edit Org" />
            </Tabs.List>
            <Tabs.Panel value="contacts" className="h-24 w-full bg-gray-50 p-4">
              {<p>test contact</p>}
            </Tabs.Panel>
            <Tabs.Panel value="components" className="h-24 w-full bg-gray-50 p-4">
              {<p>test component</p>}
            </Tabs.Panel>
            <Tabs.Panel value="editOrg" className="h-24 w-full bg-gray-50 p-4">
              {<TextField label="Vist navn" value={editedOrgName} onChange={handleOrgNameChange}></TextField>}
              {<TextField label="Organisasjonsnummer" value={editedOrgNumber} onChange={handleOrgNumberChange}></TextField>}
              {<Button variant="primary" size="medium" onClick={handleSave}>Save</Button>}
              {<Button variant="danger" size='small'>slett organisasjon</Button>} 
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
