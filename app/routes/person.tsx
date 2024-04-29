import React, { useState, useRef, useEffect } from "react";
import { Button, Table, Search, Heading, Checkbox, Dropdown } from "@navikt/ds-react";
import { PersonGroupIcon, PencilIcon } from "@navikt/aksel-icons";
import LayoutTable from "~/components/layout-table";
import EditPersonModal from "~/components/layout-modal";
import MeApi from "~/api/me-api";
import { LinksFunction, LoaderFunction, MetaFunction, json } from "@remix-run/node";
import { findKey } from "node_modules/cypress/types/lodash";
import fs from 'fs/promises';
import path from 'path';
import { useLoaderData } from "@remix-run/react";

export type PersType = {
    blank: string;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    apiResponse?: { [key: string]: boolean };
};

const persData: PersType[] = [
    {
        blank: '',
        fname: 'Luke',
        lname: 'Skywalker',
        email: 'luke.skywalker@rebelalliance.com',
        phone: '99440055'
    },
    {
        blank: '',
        fname: 'Anakin',
        lname: 'Skywalker',
        email: 'Anakin.skywalker@galacticempire.com',
        phone: '99550066'
    },
    {
        blank: '',
        fname: 'Thomas',
        lname: 'Kirkeng',
        email: 'thomas.kirkeng@darkside.com',
        phone: '40493581'
    },
    {
        blank: '',
        fname: 'Andris',
        lname: 'Hoiseth',
        email: 'andris.hoiseth@chebacca.com',
        phone: '33994455'
    }
];


export default function PersonsTable() {
    
    const [persons, setPersons] = useState<PersType[]>(persData);
    //const persons = useLoaderData<PersType[]>();
    const [searchItem, setSearchItem] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingPerson, setEditingPerson] = useState<PersType | null>(null);
    const [apiData, setApiData] = useState<{ [key: string]: boolean } | null>(null);

    if (!persons || persons.length === 0) {
        console.log("No persons data loaded");
        return <div>No data available</div>;
    }


    const handleTestClick = async () => {
        try {
            const apiData = await MeApi.postComponent("okonomi.faktura");
            console.log("Fetched API Data:", apiData);
            if (apiData && Object.keys(apiData).length > 0) {
                setApiData(apiData);
            } else {
                console.log("No valid data received from API");
            }
        } catch (error) {
            console.error("Failed to fetch API data", error);
        }
    };
    const handleTestClick2 = async (component: string) => {
        try {
            const apiData2 = await MeApi.postPackage(component);
            console.log("Fetched API Data: APIDATA2", apiData2);  // Dette er pakkene/komponentene
            if (apiData2 && Object.keys(apiData2).length > 0) {
                //const finString = key.replace("no.fint.model.", "")
                setApiData(apiData2)
                //apiData.forEach(
                //for (let i = 0; i > apiData2.length; i++) { // brukes for-løkka så kommer det ingenting ut
                //    try {
                //let apiTest: { [key: string]: boolean; } | undefined
                for (const key in apiData2) {
                    console.log(key); // Output: 'key1', 'key2'
                    const nyKey = key.replace("no.fint.model.", "")
                    try {
                        const apiTest = await MeApi.postComponent(nyKey)
                        if (apiTest) {
                            console.log("api TEST - ", apiTest)
                            //setApiData(apiTest);
                        }
                    } catch (error) {
                        console.error("Ressurs-fetchen feilet", error);
                    }
                }
                /*
                                const updatedPersons = persons.map(person => ({
                                    ...person,
                                    apiResponse: { ...person.apiResponse, ...apiTest }
                                }));
                                setPersons(updatedPersons);
                                console.log("YEEEEEHAW")
                                */
            } else {
                console.log("No valid data received from API");
            }
        } catch (error) {
            console.error("Failed to fetch API data", error);
        }
        //setIsTestClicked(true);
    };


    const editPopupWindow = (person: PersType) => {
        setEditingPerson(person);
        setIsEditing(true);
    };

    const saveChanges = async (updatedPerson: PersType) => {
        await MeApi.updatePerson(updatedPerson);
        setIsEditing(false);
    };

    const handleSearchChange = (value: string) => {
        setSearchItem(value);
    };

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
                    <Dropdown>
                        <Button size="xsmall" as={Dropdown.Toggle} icon={<PencilIcon aria-hidden />}></Button>
                        <Dropdown.Menu>
                            <Dropdown.Menu.GroupedList>
                                <Dropdown.Menu.GroupedList.Heading>Domains</Dropdown.Menu.GroupedList.Heading>
                                <Dropdown.Menu.GroupedList.Item onClick={() => { handleTestClick2("administrasjon"); editPopupWindow(person) }}>Administrasjon</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => { handleTestClick2("arkiv"); editPopupWindow(person) }}>Arkiv</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => { handleTestClick2("felles"); editPopupWindow(person) }}>Felles</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => { handleTestClick2("personvern"); editPopupWindow(person) }}>Personvern</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => { handleTestClick2("ressurser"); editPopupWindow(person) }}>Ressurser</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => { handleTestClick2("utdanning"); editPopupWindow(person) }}>Utdanning</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => { handleTestClick2("okonomi"); editPopupWindow(person) }}>Økonomi</Dropdown.Menu.GroupedList.Item>
                            </Dropdown.Menu.GroupedList>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.DataCell>
            </Table.Row>
        </Table.ExpandableRow>
    );

    const getApiContent = (person: PersType) => {
        if (!apiData || Object.keys(apiData).length === 0) {
            return "No data available";
        }


        return (
            <div>

                <Button size="xsmall" onClick={() => handleSaveClick(person)}>Save</Button>
            </div>
        );
    };

    const handleSaveClick = async (persons: PersType) => {
        // Handle save action for the person here
        console.log("Saving changes for:", persons);
    };

    const columns: { label: string; key: keyof PersType }[] = [
        { label: '', key: 'blank' }, //empty column to move header 1 step away!
        { label: 'Name', key: 'fname' }
    ];

    const handleCheckBoxChange = (personIndex: number, key: string) => {
        const updatedPersons = [...persons];
        const person = updatedPersons[personIndex];

        person.apiResponse = {
            ...person.apiResponse,
            [key]: !(person.apiResponse && person.apiResponse[key])
        };

        //setPersons(updatedPersons);
    };

    return (
        <div>
            <LayoutTable
                data={persons}
                searchItem={searchItem}
                handleSearchChange={handleSearchChange}
                columns={columns}
                renderRow={renderRow}
            />

            <EditPersonModal
                isOpen={isEditing}
                persons={editingPerson}
                onSave={saveChanges}
                onClose={() => setIsEditing(false)}
                apiData={apiData}
            />
        </div>
    );
}

export { persData };