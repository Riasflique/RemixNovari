import { SetStateAction, useState } from "react";
import "./style.css";
import { PencilIcon } from "@navikt/aksel-icons";
import { Button, HStack, Table, Search } from "@navikt/ds-react";
import { PersonIcon } from '@navikt/aksel-icons';


export type PersType = {
    fname: string;
    lname: string;
    email: string;
    phone: string;
  };
  
  const persData: PersType[] = [
    {
      fname: 'Luke',
      lname: 'Skywalker',
      email: 'luke.skywalker@rebelalliance.com',
      phone: '99440055'},

    {fname: 'Anakin',
    lname: 'Skywalker',
    email: 'Anakin.skywalker@galacticempire.com',
    phone: '99550066'},

    {fname: 'Thomas',
    lname: 'Kirkeng',
    email: 'thomas.kirkeng@darkside.com',
    phone: '40493581'},

    {fname: 'Andris',
    lname: 'Hoiseth',
    email: 'andris.hoiseth@chebacca.com',
    phone: '33994455'}
  ]


  export default function PersonsTable() {
    const [persons, setPersons] = useState(persData);
    const [searchItem, setSearchItem] = useState ('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingPerson, setIsEditingPerson] = useState<PersType |null>(null);

    const handleSearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSearchItem(e.target.value);
  };

  const editPopupWindow = (person: PersType) => {
    setIsEditingPerson(person);
    setIsEditing(true)
  }


  const filteredPers = persons.filter(persons =>
    persons.fname.toLowerCase().includes(searchItem.toLowerCase()) || 
    persons.lname.toLowerCase().includes(searchItem.toLowerCase()),);
    

    return (
      <div>
        <form data-theme="dark" role="search">
        <Button icon={<PersonIcon aria-hidden />}>Add new</Button>
        <Search
        label= "Søk"
        placeholder="Søk etter person"
        variant="simple"
        htmlSize="16"/>
        </form>
      <Table zebraStripes>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
          <Table.HeaderCell scope="col">Email</Table.HeaderCell>
          <Table.HeaderCell scope="col">Phone</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {filteredPers.map(({ fname, lname, email, phone }, i) => {
          return (
            <Table.ExpandableRow
              key={i + fname}
              content=""
            >
              <Table.DataCell scope="row">{fname + ' ' + lname}</Table.DataCell>
              <Table.DataCell>{email}</Table.DataCell>
              <Table.DataCell>{phone}</Table.DataCell>
              <Button size="xsmall" icon={<PencilIcon title="Rediger" />} />
              
            </Table.ExpandableRow>
          );
        })}
      </Table.Body>
    </Table>
    </div>
    );
  };
  
  export {persData};