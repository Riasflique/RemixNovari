import React, { useState } from 'react';
import { Modal, Button, Table, Checkbox } from '@navikt/ds-react';
import { PersType } from '~/routes/person';
import MeApi from "~/api/me-api";

type EditPersonModalProps = {
  isOpen: boolean;
  person: PersType | null;
  onSave: (person: PersType) => void;
  onClose: () => void;
  apiData: { [key: string]: boolean } | null;

};

export default function EditPersonModal({ isOpen, person, onSave, onClose, apiData }: EditPersonModalProps) {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [resources, setResources] = useState<string[]>([])

  const toggleRow = async (key: string) => {
    if (expandedRows.includes(key)) { // lista lukker seg
      setExpandedRows(expandedRows.filter((rowKey) => rowKey !== key));
    } else { // lista expander
      const nyKey = key.replace("no.fint.model.", "")
      try {
        const apiTest = await MeApi.postComponent(nyKey)
        if (apiTest) {
          const resourceNames = Object.keys(apiTest).sort()
          setResources(resourceNames)
        } else {
          console.log("else nei")
        }
      } catch (error) {
        console.error("Ressurs-fetchen feilet", error);
      }

      setExpandedRows([...expandedRows, key]);
    }
  };

  const handleSave = () => {
    if (person) {
      onSave(person);
    }
    onClose();
  };

  const handleRoleChange = (role: string) => {
    if (person) {
      const updatedApiData = {
        ...apiData,
        [role]: !apiData[role]
      };
      const updatedPerson = { ...person, apiData: updatedApiData };
      onSave(updatedPerson);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} header={{ heading: 'Components' }}>
      <Modal.Body>
        <Table>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
          {apiData &&
            Object.keys(apiData)
              .sort()
              .map((key) => (
                <React.Fragment key={key}>
                  <Table.Row>
                    <Table.DataCell>
                      <Checkbox>
                        <Button variant="tertiary-neutral" className="expand-button" onClick={() => toggleRow(key)}>
                          {key.replace("no.fint.model.", "")} {/* viser API dataene på dropdown knappen */}
                        </Button>
                      </Checkbox>
                    </Table.DataCell>
                  </Table.Row>
                  {expandedRows.includes(key) && (
                    <Table.Row>
                      <Table.DataCell colSpan={1}>
                        {resources.map((key) => (
                          <Checkbox
                            key={key}

                            onChange={() => console.log("CHANGE")}
                          >
                            {key}
                          </Checkbox>
                        ))}
                      </Table.DataCell>
                    </Table.Row>

                  )}
                </React.Fragment>

              ))}
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>Cancel</Button>

        <Button onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
