import React, { useState } from 'react';
import { Modal, Button, Table, Checkbox } from '@navikt/ds-react';
import { PersType }  from '~/routes/_person';

type EditPersonModalProps = {
  isOpen: boolean;
  person: PersType | null;
  onSave: (person: PersType) => void;
  onClose: () => void;
  apiData: { [key: string]: boolean } | null;

};

export default function EditPersonModal({ isOpen, person, onSave, onClose, apiData }: EditPersonModalProps) {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (key: string) => {
    if (expandedRows.includes(key)) {
      setExpandedRows(expandedRows.filter((rowKey) => rowKey !== key));
    } else {
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
                        {key} {/* viser API dataene på dropdown knappen */}
                      </Button>
                      </Checkbox>
                    </Table.DataCell>
                  </Table.Row>
                  {expandedRows.includes(key) && (
                    <Table.Row>
                      <Table.DataCell colSpan={1}>
                        {/* Content to be displayed when row is expanded */}
                                         
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
