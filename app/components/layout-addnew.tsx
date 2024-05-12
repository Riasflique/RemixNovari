import React, { useState, ChangeEvent, FormEvent } from "react";
import { Modal, Button, TextField} from "@navikt/ds-react";
import { PersType } from "~/routes/person";

interface AddNewPersonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (person: PersType) => void;
}

export default function AddnewLayoutTable({ isOpen, onClose, onSave }: AddNewPersonModalProps) {
    const PersonState = {
        blank: '',
        fname: '',
        lname: '',
        email: '',
        phone: ''
    }
    
    const [newPerson, setNewPerson] = useState<PersType>(PersonState);

    const handleInputChange = (field: keyof PersType, value: string) => {
        setNewPerson(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave(newPerson);
        resetFormAndClose();
    };

    const resetFormAndClose = () => {
        setNewPerson(PersonState);
        onClose()
    }

    return (
        <Modal open={isOpen} onClose={resetFormAndClose} header={{ heading: "Add New Person" }}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
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
                        value={newPerson.email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                    />
                    <TextField
                        label="Telefon"
                        value={newPerson.phone}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                    />
                    <Modal.Footer>
                    <div style={{ marginTop: '20px' }}>
                        <Button type="submit" variant="primary">Save</Button>
                        <Button type="button" variant="danger" onClick={resetFormAndClose} style={{ marginLeft: '8px' }}>Clear</Button>
                    </div>
                    </Modal.Footer>
                </form>
            </Modal.Body>
        </Modal>
    );
}