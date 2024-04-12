import React, { useState, useRef, useEffect } from "react";
import { Button, Table, Search, Heading } from "@navikt/ds-react";
import { PersonGroupIcon, PencilIcon } from "@navikt/aksel-icons";
import LayoutTable from "~/components/layout-table";
import EditPersonModal from "~/components/layout-modal";
import  MeApi from "~/api/me-api";

export type PersType = {
    fname: string;
    lname: string;
    email: string;
    phone: string;
    roller: string;
};

const persData: PersType[] = [
    {
        fname: 'Luke',
        lname: 'Skywalker',
        email: 'luke.skywalker@rebelalliance.com',
        phone: '99440055',
        roller: 'test'
    },
    { 
        fname: 'Anakin',
        lname: 'Skywalker',
        email: 'Anakin.skywalker@galacticempire.com',
        phone: '99550066',
        roller: 'test'
    },
    {
        fname: 'Thomas',
        lname: 'Kirkeng',
        email: 'thomas.kirkeng@darkside.com',
        phone: '40493581',
        roller: 'test'
    },
    {
        fname: 'Andris',
        lname: 'Hoiseth',
        email: 'andris.hoiseth@chebacca.com',
        phone: '33994455',
        roller: 'test'
    }
];

export default function PersonsTable() {
  const [persons, setPersons] = useState([]);
  const [searchItem, setSearchItem] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPerson, setEditingPerson] = useState<PersType | null>(null);


useEffect(() => {
    async function fetchData() {
        try {
            const data = await MeApi.test()
            setPersons(data);
        } catch (error) {
            console.error("Failed to fetch", error);
        }
    }

    fetchData();
}, [])



  const handleSearchChange = (value: string) => {
      setSearchItem(value);
  };

  const editPopupWindow = (person: PersType) => {
      setEditingPerson(person);
      setIsEditing(true);
  };

  const saveChanges = async (updatedPerson: any) => {
    await MeApi.updatePerson(updatedPerson);

   // setPersons(persons.map(person => person.email === updatedPerson.email ? updatedPerson: person));
    setIsEditing(false);
  };

    const columns = [
        { label: '', key: 'fname' }, //empty column to move header 1 step away!
        { label: 'Navn', key: 'fname' },
        { label: 'Roller' ,key: 'roller'}
    ];
    const headertxt = "Person";

    const renderRow = (person: PersType, index: number) => (
        <Table.ExpandableRow key={index + person.fname} content="Roller:">
            <Table.DataCell scope="row">
                {person.fname + ' ' + person.lname}
                <div>Email: {person.email}</div>
                <div>Phone: {person.phone}</div>
            </Table.DataCell>
            <Table.DataCell colSpan={4}></Table.DataCell>
            <Table.Row>
                <Table.DataCell colSpan={5}>
                    <Button size="xsmall" icon={<PencilIcon aria-hidden/>} onClick={() => editPopupWindow(person)}></Button>
                </Table.DataCell>
            </Table.Row>
        </Table.ExpandableRow>

    );
    return (
        
        <div>
            <h1 icon={<PersonGroupIcon aria-hidden/>}>Person</h1>
            <LayoutTable
                data={persons}
                searchItem={searchItem}
                handleSearchChange={handleSearchChange} 
                columns={columns}
                renderRow={renderRow}
            />

            <EditPersonModal
                isOpen={isEditing}
                person={editingPerson}
                onSave={saveChanges}
                onClose={() => setIsEditing(false)}
            />
        </div>
    );
}

export { persData };