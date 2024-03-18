import { SetStateAction, useState } from "react";
import "./style.css";
import { PencilIcon } from "@navikt/aksel-icons";
import { Button, HGrid, Table, Search, Modal, BodyLong, TextField} from "@navikt/ds-react";
import { PersonIcon } from '@navikt/aksel-icons';
import { useRef } from "react";
import { filter } from "node_modules/cypress/types/bluebird";


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
    const [editingPerson, setEditingPerson] = useState<PersType |null>(null);

    const handleSearchChange = (value: string) => {
      setSearchItem(value);
    };

  const editPopupWindow = (person: PersType) => {
    setEditingPerson(person);
    setIsEditing(true)
  }

  const saveChanges = () => {
    if (editingPerson) {
      setPersons(persons.map(person => person.email === editingPerson.email ? editingPerson : person));
    }
  }


  const filteredPers = persons.filter(persons =>
    persons.fname.toLowerCase().includes(searchItem.toLowerCase()) || 
    persons.lname.toLowerCase().includes(searchItem.toLowerCase()),);

    const ref = useRef<HTMLDialogElement>(null);
    

    return (
      <div>
        <form data-theme="dark" role="search">
        <Button icon={<PersonIcon aria-hidden />}>Add new</Button>
        <Search
        label= "Søk"
        placeholder="Søk etter person"
        variant="simple"
        htmlSize="16"
        onChange={handleSearchChange}
        value={searchItem}/>
        </form>

      <Table zebraStripes>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
          <Table.HeaderCell scope="col">Email</Table.HeaderCell>
          <Table.HeaderCell scope="col">Phone</Table.HeaderCell>
          <Table.HeaderCell scope="col">Technical</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body> 
        {filteredPers.map(({ fname, lname, email, phone }, i) => {
          return (
            <Table.ExpandableRow
              key={i + fname}
              content="Roller:"
            >
              <Table.DataCell scope="row">{fname + ' ' + lname}</Table.DataCell>
              <Table.DataCell>{email}</Table.DataCell>
              <Table.DataCell>{phone}</Table.DataCell>
              <Button size="xsmall" icon={<PencilIcon title="Rediger" onClick={() => editPopupWindow({fname, lname, email, phone})} />} />
            </Table.ExpandableRow>
          );
        })}
      </Table.Body>
    </Table>


    <Modal ref={ref} header={{heading: "Rediger"}} open={isEditing} onClose={() => setIsEditing(false)}>
              <Modal.Body>
                <BodyLong>
                  <TextField label="Navn" value={editingPerson?.fname} onChange={(e) => setEditingPerson({ ...editingPerson!, fname: e.target.value })}/>
                  <TextField label="Etternavn" value={editingPerson?.lname} onChange={(e) => setEditingPerson({ ...editingPerson!, lname: e.target.value })}/>
                  <TextField label="E-Post" value={editingPerson?.email} onChange={(e) => setEditingPerson({ ...editingPerson!, email: e.target.value })}/>
                  <TextField label="Telefon" value={editingPerson?.phone} onChange={(e) => setEditingPerson({ ...editingPerson!, phone: e.target.value })}/>
                </BodyLong>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => setIsEditing(false)}>Avbryt</Button>
                <Button onClick={saveChanges}>Lagre</Button>
              </Modal.Footer>
            </Modal>

    </div>
    );
  };
  
  export {persData};