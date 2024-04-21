import React, { useState, useRef, useEffect } from "react";
import { Button, Table, Search, Heading, Checkbox, Dropdown } from "@navikt/ds-react";
import { PersonGroupIcon, PencilIcon } from "@navikt/aksel-icons";
import LayoutTable from "~/components/layout-table";
import EditPersonModal from "~/components/layout-modal";
import MeApi from "~/api/me-api";
import { LoaderFunction, json } from "@remix-run/node";
import { clear } from "console";

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
        fname: 'test',
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

export default function PersonsTable() {
    const [persons, setPersons] = useState(persData);
    const [searchItem, setSearchItem] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingPerson, setEditingPerson] = useState<PersType | null>(null);
    const [isTestClicked, setIsTestClicked] = useState(false);

    const handleTestClick = async (domain: string) => {
        try {
            const apiData = await MeApi.postComponent(domain);
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
        setIsTestClicked(true);
    };

    const handleTestClick2 = async () => {
        try {
            const apiData = await MeApi.postComponent();
            console.log("Fetched API Data:", apiData);  // Ensure this logs expected data
            if (apiData && Object.keys(apiData).length > 0) {
                /*const updatedPersons = persons.map(person => ({
                    ...person,
                    apiResponse: { ...person.apiResponse, ...apiData }
                }));
                setPersons(updatedPersons);*/
                console.log("YEEEEEHAW")
            } else {
                console.log("No valid data received from API");
            }
        } catch (error) {
            console.error("Failed to fetch API data", error);
        }
        setIsTestClicked(true);
    };


    const handleCheckBoxChange = (personIndex: number, key: string) => {
        const updatedPersons = [...persons];
        const person = updatedPersons[personIndex];

        person.apiResponse = {
            ...person.apiResponse,
            [key]: !(person.apiResponse && person.apiResponse[key])
        };

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
        var sortedKeys = Object.keys(person.apiResponse).sort(); // Dette er en liste med ressurser som jeg prøver å nullstille
        const cleared = document.getElementById("testt")
        console.log("FØRSTE")
        console.log(sortedKeys)

        if (Object.keys(person.apiResponse).length > 0) {

            sortedKeys = []   // burde funke for å gjøre lista tom
            console.log("ANDRE")
            console.log(sortedKeys)
            while (sortedKeys.length > 0) {
                sortedKeys.pop(); // burde også funke, men det skjer ikke noe
            }
        }
        sortedKeys = Object.keys(person.apiResponse).sort();
        console.log("TREDJE")
        console.log(sortedKeys)
        return (
            <div id="testt">
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

    const columns: { label: string; key: keyof PersType }[] = [
        { label: '', key: 'blank' }, //empty column to move header 1 step away!
        { label: 'Navn', key: 'fname' },
        { label: 'Roller', key: 'roller' }
    ];
    const headertxt = "Person";

    const renderRow = (person: PersType, index: number) => (
        <Table.ExpandableRow key={index + person.fname} content={getApiContent(person)}>
            <Table.DataCell scope="row">
                {person.fname + ' ' + person.lname}
                <div>Email: {person.email}</div>
                <div>Phone: {person.phone}</div>
            </Table.DataCell>
            <Table.DataCell colSpan={4}></Table.DataCell>
            <Table.Row>
                <Table.DataCell colSpan={5}>
                    <Button size="xsmall" icon={<PencilIcon aria-hidden />} onClick={() => editPopupWindow(person)}></Button>
                    <Button size="xsmall" icon={<PencilIcon aria-hidden />} onClick={() => handleTestClick("administrasjon")}>Test</Button>
                    <Dropdown>
                        <Button size="xsmall" as={Dropdown.Toggle}>Ressurstilgang</Button>
                        <Dropdown.Menu>
                            <Dropdown.Menu.GroupedList>
                                <Dropdown.Menu.GroupedList.Heading>Domains</Dropdown.Menu.GroupedList.Heading>
                                <Dropdown.Menu.GroupedList.Item onClick={() => { handleTestClick("administrasjon") }}>Administrasjon</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => { handleTestClick("arkiv") }}>Arkiv</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => { handleTestClick("felles") }}>Felles</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => { handleTestClick("personvern") }}>Personvern</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => { handleTestClick("ressurser") }}>Ressurser</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => { handleTestClick("utdanning") }}>Utdanning</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => { handleTestClick("okonomi") }}>Økonomi</Dropdown.Menu.GroupedList.Item>
                            </Dropdown.Menu.GroupedList>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.DataCell>
            </Table.Row>
        </Table.ExpandableRow>
    );

    return (
        <div>
            <h1>Person</h1>
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
