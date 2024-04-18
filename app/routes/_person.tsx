import React, { useState, useRef, useEffect } from "react";
import { Button, Table, Search, Heading, Checkbox } from "@navikt/ds-react";
import { PersonGroupIcon, PencilIcon } from "@navikt/aksel-icons";
import LayoutTable from "~/components/layout-table";
import EditPersonModal from "~/components/layout-modal";
import MeApi from "~/api/me-api";
import { LoaderFunction, json } from "@remix-run/node";

export type PersType = {
    blank: string;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    roller: string;
    apiResponse?: { [key: string]: boolean };
};

const persData: PersType[] = [
    {
        blank: '',
        fname: 'Luke',
        lname: 'Skywalker',
        email: 'luke.skywalker@rebelalliance.com',
        phone: '99440055',
        roller: 'jedi'
    },
    {
        blank: '',
        fname: 'Anakin',
        lname: 'Skywalker',
        email: 'Anakin.skywalker@galacticempire.com',
        phone: '99550066',
        roller: 'sith'
    },
    {
        blank: '',
        fname: 'Thomas',
        lname: 'Kirkeng',
        email: 'thomas.kirkeng@darkside.com',
        phone: '40493581',
        roller: 'test'
    },
    {
        blank: '',
        fname: 'Andris',
        lname: 'Hoiseth',
        email: 'andris.hoiseth@chebacca.com',
        phone: '33994455',
        roller: 'test'
    }
];

export const loader: LoaderFunction = async ({ request }) => {
    return json(await MeApi.fetchDisplayName());
}
<<<<<<< HEAD
=======

>>>>>>> 8adde3d54b890a512afe6465d439273d1449543b

export default function PersonsTable() {
    const [persons, setPersons] = useState(persData);
    const [searchItem, setSearchItem] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingPerson, setEditingPerson] = useState<PersType | null>(null);
<<<<<<< HEAD
    const [isTestClicked, setIsTestClicked] = useState(false);

    const handleTestClick = async () => {
        try {
            const apiData = await MeApi.postComponent();
=======

    const handleTestClick = async () => {
        try {
            const apiData = await MeApi.test();
>>>>>>> 8adde3d54b890a512afe6465d439273d1449543b
            console.log("Fetched API Data:", apiData);  // Ensure this logs expected data
            if (apiData && Object.keys(apiData).length > 0) {
                const updatedPersons = persons.map(person => ({
                    ...person,
                    apiResponse: { ...person.apiResponse, ...apiData }
                }));
                setPersons(updatedPersons);
            } else {
                console.log("No valid data received from API");
            }
        } catch (error) {
            console.error("Failed to fetch API data", error);
        }
<<<<<<< HEAD
        setIsTestClicked(true);
=======
>>>>>>> 8adde3d54b890a512afe6465d439273d1449543b
    };

    const handleCheckBoxChange = (personIndex: number, key: string) => {
        const updatedPersons = [...persons];
        const person = updatedPersons[personIndex];

        person.apiResponse = {
            ...person.apiResponse,
            [key]: !(person.apiResponse && person.apiResponse[key])
        };
<<<<<<< HEAD

        setPersons(updatedPersons);
    };

    const handleSearchChange = (value: string) => {
        setSearchItem(value);
    };

    const editPopupWindow = (person: PersType) => {
        setEditingPerson(person);
        setIsEditing(true);
    };

    const saveChanges = async (updatedPerson: any) => {
        await MeApi.updatePerson(updatedPerson);
        setIsEditing(false);
    };

    const getApiContent = (person: PersType) => {
        if (!person.apiResponse || Object.keys(person.apiResponse).length === 0) {
            return "No data available";
        }

        const sortedKeys = Object.keys(person.apiResponse).sort();

        return (
            <div>
                {sortedKeys.map((key) => (
                    <Checkbox
                        key={key}
                        checked={person.apiResponse![key]}
                        onChange={() => handleCheckBoxChange(persons.findIndex(p => p.email === person.email), key)}
                    >
                        {key}
                    </Checkbox>
                ))}
                {isTestClicked && (
                    <Button size="xsmall" onClick={() => handleSaveClick(person)}>Save</Button>
                )}
            </div>
        );
    };

    const handleSaveClick = async (person: PersType) => {
        // Handle save action for the person here
        console.log("Saving changes for:", person);
    };

=======

        setPersons(updatedPersons);
    }

    function getApiContent(person: PersType) {
        if (!person.apiResponse || Object.keys(person.apiResponse).length === 0) {
            return "No data available";
        }
        return (
            <div>
                {Object.entries(person.apiResponse).map(([key, value]) => (
                    <Checkbox
                        key={key}
                        checked={value}
                        onChange={() => handleCheckBoxChange(persons.findIndex(person => person.email === person.email), key)}
                    >{key}
                    </Checkbox>
                ))}
            </div>
        );

    }

    const handleSearchChange = (value: string) => {
        setSearchItem(value);
    };

    const editPopupWindow = (person: PersType) => {
        setEditingPerson(person);
        setIsEditing(true);
    };

    const saveChanges = async (updatedPerson: any) => {
        await MeApi.updatePerson(updatedPerson);

        //setPersons(persons.map(person => person.email === updatedPerson.email ? updatedPerson: person));
        setIsEditing(false);
    };
>>>>>>> 8adde3d54b890a512afe6465d439273d1449543b
    const columns: { label: string; key: keyof PersType }[] = [
        { label: '', key: 'blank' }, //empty column to move header 1 step away!
        { label: 'Navn', key: 'fname' },
        { label: 'Roller', key: 'roller' }
    ];
    const headertxt = "Person";

    const renderRow = (person: PersType, index: number) => (
<<<<<<< HEAD
        <Table.ExpandableRow key={index + person.fname} content={getApiContent(person)}>
=======

        <Table.ExpandableRow key={index + person.fname}
            content={getApiContent(person)}>
>>>>>>> 8adde3d54b890a512afe6465d439273d1449543b
            <Table.DataCell scope="row">
                {person.fname + ' ' + person.lname}
                <div>Email: {person.email}</div>
                <div>Phone: {person.phone}</div>
            </Table.DataCell>
            <Table.DataCell colSpan={4}></Table.DataCell>
            <Table.Row>
                <Table.DataCell colSpan={5}>
                    <Button size="xsmall" icon={<PencilIcon aria-hidden />} onClick={() => editPopupWindow(person)}></Button>
                    <Button size="xsmall" icon={<PencilIcon aria-hidden />} onClick={() => handleTestClick()}>Test</Button>
                </Table.DataCell>
            </Table.Row>
        </Table.ExpandableRow>
<<<<<<< HEAD
=======


>>>>>>> 8adde3d54b890a512afe6465d439273d1449543b
    );

    return (
<<<<<<< HEAD
=======


>>>>>>> 8adde3d54b890a512afe6465d439273d1449543b
        <div>
            <h1>Person</h1>
            <LayoutTable
                data={persons}
                searchItem={searchItem}
                handleSearchChange={handleSearchChange}
<<<<<<< HEAD
=======
                handleSearchChange={handleSearchChange}
>>>>>>> 8adde3d54b890a512afe6465d439273d1449543b
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
