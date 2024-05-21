// EditPersonModal.tsx

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
  const [checkboxState, setCheckboxState] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (persons && persons.access) {
      const initialCheckboxState = persons.access.split(',').reduce((acc, item) => {
        acc[item] = true;
        return acc;
      }, {} as { [key: string]: boolean });
      setCheckboxState(initialCheckboxState);
    }
  }, [persons]);

  const handleCheckboxChange = (key: string, isChecked: boolean) => {
    setCheckboxState({ ...checkboxState, [key]: isChecked });
  };

  const handleSave = () => {
    if (persons) {
      const updatedAccess = Object.keys(checkboxState).filter(key => checkboxState[key]).join(',');
      const updatedPerson = { ...persons, access: updatedAccess };
      onSave(updatedPerson);
    }
    onClose();
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
          setExpandedRows(prevRows => [...prevRows, key]);
        }
      } catch (error) {
        console.error("Resource fetch failed", error);
      }
    }
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
                    onChange={e => handleCheckboxChange(key, e.target.checked)}
                  >
                    <Button variant="tertiary-neutral" className="expand-button" onClick={() => toggleRow(key)}>
                      {key.replace("no.fint.model.", "")}
                    </Button>
                  </Checkbox>
                </Table.DataCell>
              </Table.Row>
              {expandedRows.includes(key) && (
                <Table.Row>
                  <Table.DataCell colSpan={1}>
                    <CheckboxGroup legend="Resources" hideLegend={true} size='small'>
                      {Object.keys(apiData[key] || {}).map((resource) => (
                        <Checkbox
                          id={`checkbox-${key}-${resource}`}
                          key={`${key}.${resource}`}
                          checked={checkboxState[`${key}.${resource}`] || false}
                          onChange={e => handleCheckboxChange(`${key}.${resource}`, e.target.checked)}
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
        <Button onClick={handleSave}>Save</Button>
      </Modal.Body>
      <Modal.Footer>
        <Button id="cancel-button" variant="danger" onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}
