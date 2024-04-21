import React, { useState } from 'react';
import { Modal, Button, Table, Checkbox } from '@navikt/ds-react';
import { PersType } from '~/routes/_person';

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
    <Modal open={isOpen} onClose={onClose} header={{ heading: 'Rediger' }}>
      <Modal.Body>
        <Table>
          <Table.Row>
            <Table.HeaderCell>Rolle</Table.HeaderCell>
          </Table.Row>
          {apiData &&
            Object.keys(apiData)
              .sort()
              .map((key) => (
                <React.Fragment key={key}>
                  <Table.Row>
                    <Table.DataCell>
                      <button className="expand-button" onClick={() => toggleRow(key)}>
                        {key} {/* viser API dataene på dropdown knappen */}
                      </button>
                    </Table.DataCell>
                  </Table.Row>
                  {expandedRows.includes(key) && (
                    <Table.Row>
                      <Table.DataCell colSpan={1}>
                        {/* Content to be displayed when row is expanded */}
                        <Checkbox
                          checked={apiData[key]}
                          onChange={() => handleRoleChange(key)}
                        >
                          {key} {/*Key byttes ut med API kode som skal vise underklassene i dropdown menyen (current key viser bare det vi har fra før atm) */ }
                        </Checkbox>
                      </Table.DataCell>
                    </Table.Row>
                  )}
                </React.Fragment>
              ))}
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Avbryt</Button>
        <Button onClick={handleSave}>Lagre</Button>
      </Modal.Footer>
    </Modal>
  );
}
