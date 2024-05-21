import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import MeApi from "~/api/me-api";
import React, { useState } from "react";
import { Button, Table, Dropdown } from "@navikt/ds-react";
import { PencilIcon } from "@navikt/aksel-icons";
import LayoutTable from "~/components/layout-table";
import EditPersonModal from "~/components/layout-modal";

export type PersType = {
    blank: any;
    apiResponse?: { [key: string]: boolean };
    fname: string;
    lname: string;
    id: number;
    access: string;
    phone: string;
    mail: string;
};

export const persData: PersType[] = [];

export const loader: LoaderFunction = async () => {
    const users = await MeApi.fetchUsers();
    if (!users) {
        throw new Response("Error fetching users", { status: 500 });
    }
    console.log("Fetched users:", users);
    return json(users);
};

export default function PersonsTable() {
    const persons = useLoaderData<PersType[]>();
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
        console.log("Kjører nuuuuuuu skibidi");
        try {
            const apiData2 = await MeApi.postPackage(component);
            console.log("Fetched API Data: APIDATA2", apiData2);
            if (apiData2 && Object.keys(apiData2).length > 0) {
                setApiData(apiData2);
                for (const key in apiData2) {
                    console.log(key);
                    const nyKey = key.replace("no.fint.model.", "");
                    try {
                        const apiTest = await MeApi.postComponent(nyKey);
                        if (apiTest) {
                            console.log("api TEST - ", apiTest);
                        }
                    } catch (error) {
                        console.error("Ressurs-fetchen feilet", error);
                    }
                }
            } else {
                console.log("No valid data received from API");
            }
        } catch (error) {
            console.error("Failed to fetch API data", error);
        }
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
                <div>Email: {person.mail}</div>
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
        console.log("Saving changes for:", persons);
    };

    const columns: { label: string; key: keyof PersType }[] = [
        { label: '', key: 'blank' },
        { label: 'Name', key: 'fname' }
    ];

    const handleCheckBoxChange = (personIndex: number, key: string) => {
        const updatedPersons = [...persons];
        const person = updatedPersons[personIndex];

        person.apiResponse = {
            ...person.apiResponse,
            [key]: !(person.apiResponse && person.apiResponse[key])
        };
    };

    return (
        <div>
            <LayoutTable
                data={persons}
                searchItem={searchItem}
                handleSearchChange={handleSearchChange}
                columns={columns}
                renderRow={renderRow}
                tableType="Clients"
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
