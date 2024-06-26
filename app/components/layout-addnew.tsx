import React, { useState, ChangeEvent, FormEvent } from "react";
import { Modal, Button, TextField } from "@navikt/ds-react";
import { useFetcher } from "@remix-run/react";
import { PersType } from "~/routes/person";
import MeApi from "~/api/me-api";

interface AddNewPersonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (persons: PersType[]) => void;
}

// Defineres med alt som er fra PersType i person.tsx
type PersonState = Omit<PersType, "id" | "access" | "apiResponse"> & {
    id?: number;
    access?: string;
    apiResponse?: any;
};

const AddNewPersonModal: React.FC<AddNewPersonModalProps> = ({ isOpen, onClose, onSave }) => {
    const fetcher = useFetcher();
    const initialPersonState: PersonState = {
        blank: '',
        fname: '',
        lname: '',
        mail: '',
        phone: '',
        id: 0,
        access: '',
        apiResponse: null,
    };

    const [newPerson, setNewPerson] = useState<PersonState>(initialPersonState);

    const handleInputChange = (field: keyof PersonState, value: string) => {
        setNewPerson((prev) => ({ 
            ...prev, 
            [field]: field === 'phone' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const personToSave: PersType = {
                ...newPerson,
                id: newPerson.id || 0,
                access: newPerson.access || '',
                apiResponse: newPerson.apiResponse || null,
            };

            await MeApi.addUser(personToSave);

            const updatedUsers = await MeApi.fetchUsers();

            onSave(updatedUsers);

            resetFormAndClose();
        } catch (error) {
            console.error("Failed to add new person:", error);
        }
    };

    const resetFormAndClose = () => {
        setNewPerson(initialPersonState);
        onClose();
    };

    return (
        <Modal open={isOpen} onClose={resetFormAndClose} header={{ heading: "Add New Person" }}>
            <Modal.Body>
                <fetcher.Form onSubmit={handleSubmit}>
                    <TextField
                        label="Fornavn"
                        value={newPerson.fname}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('fname', e.target.value)}
                    />
                    <TextField
                        label="Etternavn"
                        value={newPerson.lname}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('lname', e.target.value)}
                    />
                    <TextField
                        label="Email"
                        value={newPerson.mail}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('mail', e.target.value)}
                    />
                    <TextField
                        label="Telefon"
                        value={newPerson.phone.toString()}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                    />
                    <Modal.Footer>
                        <div style={{ marginTop: '20px' }}>
                            <Button type="submit" variant="primary">Save</Button>
                            <Button type="button" variant="danger" onClick={resetFormAndClose} style={{ marginLeft: '8px' }}>Clear</Button>
                        </div>
                    </Modal.Footer>
                </fetcher.Form>
            </Modal.Body>
        </Modal>
    );
}

export default AddNewPersonModal;
