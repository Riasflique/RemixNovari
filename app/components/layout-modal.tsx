import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { PersType } from '~/routes/person';
import MeApi from "~/api/me-api";

type EditPersonModalProps = {
    isOpen: boolean;
    persons: PersType | null;
    onSave: (person: PersType) => void;
    onClose: () => void;
    apiData: { [key: string]: boolean } | null;
};

export default function EditPersonModal({ isOpen, persons, onSave, onClose, apiData }: EditPersonModalProps) {
    const [expandedRows, setExpandedRows] = useState<string[]>([]);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [resourcesByMaster, setResourcesByMaster] = useState<{ [key: string]: string[] }>({});

    useEffect(() => {
        if (persons && persons.apiResponse) {
            setSelectedValues(Object.keys(persons.apiResponse).filter(key => persons.apiResponse![key]));
        }
    }, [persons]);

    useEffect(() => {
        if (apiData) {
            const initialChecked = Object.keys(apiData).filter(key => apiData[key]);
            setSelectedValues(initialChecked);
        }
    }, [apiData]);

    const handleMasterCheckboxChange = (key: string, isChecked: boolean) => {
        let newValues = [...selectedValues];
        if (isChecked) {
            newValues.push(key);
            if (resourcesByMaster[key]) {
                resourcesByMaster[key].forEach(resource => {
                    newValues.push(`${key}.${resource}`);
                });
            }
        } else {
            newValues = newValues.filter(item => item !== key && !item.startsWith(`${key}.`));
        }
        setSelectedValues(newValues);
    };

    const toggleRow = async (key: string) => {
        if (expandedRows.includes(key)) {
            setExpandedRows(prevRows => prevRows.filter(row => row !== key));
        } else {
            const formattedKey = key.replace("no.fint.model.", "");
            try {
                const apiResponse = await MeApi.postComponent(formattedKey);
                if (apiResponse && Object.keys(apiResponse).length > 0) {
                    const resourceNames = Object.keys(apiResponse).sort();
                    setResourcesByMaster(prev => ({ ...prev, [key]: resourceNames }));
                    setExpandedRows(prevRows => [...prevRows, key]);
                }
            } catch (error) {
                console.error("Resource fetch failed", error);
            }
        }
    };

    const handleSave = () => {
        if (persons) {
            const updatedPerson = { 
                ...persons, 
                apiResponse: Object.fromEntries(selectedValues.map(key => [key, true])) 
            };
            onSave(updatedPerson);
        }
        onClose();
    };

    return (
        <Modal open={isOpen} onClose={onClose} header={{ heading: 'Components' }}>
            <Modal.Body>
                <Table>
                    {apiData && Object.keys(apiData).sort().map((key) => (
                        <React.Fragment key={key}>
                            <Table.Row>
                                <Table.DataCell>
                                    <Checkbox
                                        id={`checkbox-${key}`}
                                        value={key}
                                        checked={selectedValues.includes(key)}
                                        onChange={e => handleMasterCheckboxChange(key, e.target.checked)}
                                    >
                                        <Button variant="tertiary-neutral" className="expand-button" onClick={() => toggleRow(key)}>{key.replace("no.fint.model.", "")}</Button>
                                    </Checkbox>
                                </Table.DataCell>
                            </Table.Row>
                            {expandedRows.includes(key) && resourcesByMaster[key] && (
                                <Table.Row>
                                    <Table.DataCell colSpan={1}>
                                        <CheckboxGroup legend="Resources" hideLegend={true} size='small' value={selectedValues} onChange={setSelectedValues}>
                                            {resourcesByMaster[key].map((resource) => (
                                                <Checkbox
                                                    id={`checkbox-${key}-${resource}`}
                                                    key={`${key}.${resource}`}
                                                    value={`${key}.${resource}`}
                                                >
                                                    {resource}
                                                </Checkbox>
                                            ))}
                                        </CheckboxGroup>
                                    </Table.DataCell>
                                </Table.Row>
                            )}
                        </React.Fragment>
                    ))}
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button id="cancel-button" variant="danger" onClick={onClose}>Cancel</Button>
                <Button id="save-button" onClick={handleSave}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}
