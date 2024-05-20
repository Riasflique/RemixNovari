import React, { useState } from 'react';
import { useLocation } from '@remix-run/react';
import { Tabs, Heading, TextField, Button , Select} from "@navikt/ds-react";
import { PersonGroupIcon, ComponentIcon, PencilIcon, Buildings3Icon} from '@navikt/aksel-icons';
import { PersType, persData } from './person';

export default function OrgView() {
  const location = useLocation();
  const { org } = location.state;
  const [selectedTab, setSelectedTab] = useState("contacts");
  const [org_Name, setOrgName] = useState(org.org_Name); 
  const [org_Number, setOrgNumber] = useState(org.org_Number);
  const [editedOrgName, setEditedOrgName] = useState(org.org_Name); 
  const [editedOrgNumber, setEditedOrgNumber] = useState(org.org_Number); 
  const [editedContact, setEditedContact] = useState("")
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

  const handleContactChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    
  };
  
  const handleUpdateContact = () => {
    setEditedContact(editedContact);
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
        <h3>{org_Name}</h3>
        <p>Org number: {org_Number}</p>
        <p>Primary Asset Id: {org.AssetId}</p>
        <p>Legal Contact: {editedContact}</p>
        <div className='Tabs'>
          <Tabs defaultValue="editOrg" onChange={handleTabChange}>
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
              {<Button id="save-org" variant="primary" size="medium" onClick={handleSave}>Save</Button>}
              <Select label="Oppdater juridisk kontakt" value={editedContact} onChange={handleContactChange}>
                <option label=''></option>
               {persData.map((person, index) => (
               <option key={index} value={`${person.fname} ${person.lname}`}>
                {`${person.fname} ${person.lname}`}
              </option>
              ))}
              </Select>
              <Button size='small'onClick={handleUpdateContact}>Rediger</Button>
              {<Button variant="danger" size='small'>slett organisasjon</Button>} 
              
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
