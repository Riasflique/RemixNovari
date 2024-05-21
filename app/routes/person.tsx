import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import MeApi from "~/api/me-api";
import React, { useState, useEffect } from "react";
import { Button, Table, Dropdown, Heading } from "@navikt/ds-react";
import { PencilIcon } from "@navikt/aksel-icons";
import LayoutTable from "~/components/layout-table";
import EditPersonModal from "~/components/layout-modal";
import Header from "@navikt/ds-react/esm/table/Header";

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

export const persData: PersType[] = []; // Ensure this is exported


const transformData = (data: any[]): PersType[] => {
    return data.map(item => ({
        blank: item.blank ?? null,
        apiResponse: item.apiResponse || {},
        fname: item.fname,
        lname: item.lname,
        id: item.id,
        access: item.access,
        phone: item.phone,
        mail: item.mail,
    }));
};

export const loader: LoaderFunction = async () => {
    const users = await MeApi.fetchUsers();
    if (!users) {
        throw new Response("Error fetching users", { status: 500 });
    }
    const transformedUsers = transformData(users);
    console.log("Fetched and transformed users:", transformedUsers);
    return json(transformedUsers);
};

export default function PersonsTable() {
    const personsData = useLoaderData<PersType[]>();
    const [searchItem, setSearchItem] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingPerson, setEditingPerson] = useState<PersType | null>(null);
    const [apiData, setApiData] = useState<{ [key: string]: boolean } | null>(null);
    const [persons, setPersons] = useState<PersType[]>([]);

    useEffect(() => {
        setPersons(personsData as PersType[]);
    }, [personsData]);

    const handleTestClick2 = async (component: string, person: PersType) => {
        try {
            const apiData2 = await MeApi.postPackage(component);
            console.log("Fetched API Data: APIDATA2", apiData2);
            if (apiData2 && Object.keys(apiData2).length > 0) {
                setApiData(apiData2);
                for (const key in apiData2) {
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
                editPopupWindow(person, apiData2);
            } else {
                console.log("No valid data received from API");
            }
        } catch (error) {
            console.error("Failed to fetch API data", error);
        }
    };

    const editPopupWindow = (person: PersType, apiData: { [key: string]: boolean }) => {
        setEditingPerson(person);
        setApiData(apiData);
        setIsEditing(true);
    };

    const saveChanges = async (updatedPerson: PersType) => {
        setPersons(prevPersons =>
            prevPersons.map(p =>
                p.id === updatedPerson.id ? updatedPerson : p
            )
        );
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
                                <Dropdown.Menu.GroupedList.Item onClick={() => handleTestClick2("administrasjon", person)}>Administrasjon</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => handleTestClick2("arkiv", person)}>Arkiv</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => handleTestClick2("felles", person)}>Felles</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => handleTestClick2("personvern", person)}>Personvern</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => handleTestClick2("ressurser", person)}>Ressurser</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => handleTestClick2("utdanning", person)}>Utdanning</Dropdown.Menu.GroupedList.Item>
                                <Dropdown.Menu.GroupedList.Item onClick={() => handleTestClick2("okonomi", person)}>Økonomi</Dropdown.Menu.GroupedList.Item>
                            </Dropdown.Menu.GroupedList>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.DataCell>
            </Table.Row>
        </Table.ExpandableRow>
    );

    const getApiContent = (person: PersType) => {
        if (!person.apiResponse || Object.keys(person.apiResponse).length === 0) {
            return "No data available";
        }
        
        const relevantData = Object.entries(person.apiResponse)
            .filter(([key, value]) => value)
            .map(([key]) => key.replace("no.fint.model.", ""));

        return (
            <div>
            <Heading size="small">Tilganger</Heading>
            <ul>
                {relevantData.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
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