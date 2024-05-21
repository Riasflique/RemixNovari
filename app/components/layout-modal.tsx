// EditPersonModal.tsx

import React, { useState } from 'react';
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
    const [checkboxState, setCheckboxState] = useState<{ [key: string]: boolean }>({});
    const [resourcesByMaster, setResourcesByMaster] = useState<{ [key: string]: string[] }>({});
    const [packages, setPackages] = useState<string[]>([]);

    const handleMasterCheckboxChange = (key: string, isChecked: boolean) => {
        const newStates = { ...checkboxState, [key]: isChecked };
        if (resourcesByMaster[key]) {
            resourcesByMaster[key].forEach(resource => {
                newStates[`${key}.${resource}`] = isChecked;
            });
        }
        setCheckboxState(newStates);
    };

    const handleCheckboxChanges = (masterKey: string, resourceKey: string, isChecked: boolean) => {
        const newStates = { ...checkboxState, [`${masterKey}.${resourceKey}`]: isChecked };
        if (masterKey === resourceKey && resourcesByMaster[masterKey]) {
            resourcesByMaster[masterKey].forEach(resource => {
                newStates[`${masterKey}.${resource}`] = isChecked;
            });
        } else if (resourcesByMaster[masterKey]) {
            const allChecked = resourcesByMaster[masterKey].every(resource => newStates[`${masterKey}.${resource}`]);
            newStates[masterKey] = allChecked;
        }
        setCheckboxState(newStates);
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

    const handleFetchPackages = async () => {
        try {
            const fetchedPackages = await MeApi.getPackages();
            if (fetchedPackages) {
                setPackages(fetchedPackages);
            } else {
                console.error("No packages fetched");
            }
        } catch (error) {
            console.error("Failed to fetch packages", error);
        }
    };

    const handleSave = () => {
        if (persons) {
            onSave(persons);
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
                                        checked={checkboxState[key] || false}
                                        onChange={e => handleMasterCheckboxChange(key, e.target.checked)}
                                    >
                                        <Button variant="tertiary-neutral" className="expand-button" onClick={() => toggleRow(key)}>{key.replace("no.fint.model.", "")}</Button>
                                    </Checkbox>
                                </Table.DataCell>
                            </Table.Row>
                            {expandedRows.includes(key) && resourcesByMaster[key] && (
                                <Table.Row>
                                    <Table.DataCell colSpan={1}>
                                        <CheckboxGroup legend="Resources" hideLegend={true} size='small'>
                                            {resourcesByMaster[key].map((resource) => (
                                                <Checkbox
                                                    id={`checkbox-${key}-${resource}`}
                                                    key={`${key}.${resource}`}
                                                    checked={checkboxState[`${key}.${resource}`] || false}
                                                    onChange={e => handleCheckboxChanges(key, resource, e.target.checked)}
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
                <Button onClick={handleFetchPackages}>Hent</Button>
                {packages.length > 0 && (
                    <ul>
                        {packages.map((pkg, index) => (
                            <li key={index}>{pkg}</li>
                        ))}
                    </ul>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button id="cancel-button" variant="danger" onClick={onClose}>Cancel</Button>
                <Button id="save-button" onClick={handleSave}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}
