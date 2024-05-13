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


  const handleMasterCheckboxChange = (key: string, isChecked: boolean) => {
  
    const newStates = {...checkboxState, [key]: isChecked};
    
    if (resourcesByMaster[key]) {
      resourcesByMaster[key].forEach(resource => {
        newStates[`${key}.${resource}`] = isChecked;
      });
    }
    setCheckboxState(newStates);
  };


const handleCheckboxChanges = (masterKey: string, resourceKey: string, isChecked: boolean) => {
  const newStates = { ...checkboxState, [`${masterKey}.${resourceKey}`]: isChecked };

  // Update the master checkbox based on all its subordinates
  if (masterKey === resourceKey && resourcesByMaster[masterKey]) {
    // Direct master checkbox toggle affects all subordinates
    resourcesByMaster[masterKey].forEach(resource => {
      newStates[`${masterKey}.${resource}`] = isChecked;
    });
  } else if (resourcesByMaster[masterKey]) {
    // Check if all subordinates are now checked to decide on master checkbox state
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
                    id={`checkbox-${key}`} // Added ID to checkbox
                    checked={checkboxState[key] || false}
                    onChange={e => handleMasterCheckboxChange(key, e.target.checked)} // Assuming the key is both the masterKey and resourceKey in this context
                  >
                  <Button variant="tertiary-neutral" className="expand-button" onClick={() => toggleRow(key)}>{key.replace("no.fint.model.", "")}</Button>
                  </Checkbox>
                </Table.DataCell>
              </Table.Row>
              {expandedRows.includes(key) && resourcesByMaster[key] && (
                <Table.Row>
                  <Table.DataCell colSpan={1}>
                  <CheckboxGroup
                          legend="Resources"
                          hideLegend={true}
                          size='small'
                        >
                    {resourcesByMaster[key].map((resource) => (
                      <Checkbox
                        id={`checkbox-${key}-${resource}`} // Added ID to checkbox
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
      </Modal.Body>
      <Modal.Footer>
        <Button id="cancel-button" variant="danger" onClick={onClose}>Cancel</Button>
        <Button id="save-button" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
