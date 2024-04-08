import React, { useState, useRef } from "react";
import { Button, Table, Search } from "@navikt/ds-react";
import { PersonIcon, PencilIcon } from "@navikt/aksel-icons";
import LayoutTable from "~/components/layout-table";
import EditPersonModal from "~/components/layout-modal";

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
  const [persons, setPersons] = useState(persData);
  const [searchItem, setSearchItem] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPerson, setEditingPerson] = useState<PersType | null>(null);

  const handleSearchChange = (value: string) => {
      setSearchItem(value);
  };

  const editPopupWindow = (person: PersType) => {
      setEditingPerson(person);
      setIsEditing(true);
  };

  const saveChanges = (updatedPerson: PersType) => {
      setPersons(persons.map(person => person.email === updatedPerson.email ? updatedPerson: person));
      setIsEditing(false);
  };

    const columns = [
        { label: '', key: 'fname' }, //empty column to move header 1 step away!
        { label: 'Navn', key: 'fname' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'Roller' ,key: 'roller'}
    ];

    const renderRow = (person: PersType, index: number) => (
      
        <Table.ExpandableRow key={index + person.fname} content="Roller:">
            <Table.DataCell scope="row">{person.fname + ' ' + person.lname}</Table.DataCell>
            <Table.DataCell>{person.email}</Table.DataCell>
            <Table.DataCell>{person.phone}</Table.DataCell>
            <Table.DataCell>{person.roller}</Table.DataCell>
            <Button size="xsmall" icon={<PencilIcon title="Rediger" onClick={() => editPopupWindow(person)} />} />
        </Table.ExpandableRow>
    );

    return (
        <div>
            <LayoutTable
                data={persData}
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
