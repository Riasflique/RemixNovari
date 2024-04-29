import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { PersType } from '~/routes/_person';
import MeApi from "~/api/me-api";

type EditPersonModalProps = {
  isOpen: boolean;
  person: PersType | null;
  onSave: (person: PersType) => void;
  onClose: () => void;
  apiData: { [key: string]: boolean } | null;

};

export default function EditPersonModal({ isOpen, person, onSave, onClose, apiData }: EditPersonModalProps) {
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [resources, setResources] = useState<Record<string, string[]>>({})
  const [packageBoxCheck, setPackageBoxCheck] = useState<Record<string, boolean>>({})
  //const [resourcesBoxCheck, setResourcesBoxCheck] = useState<any[]>([])
  const [allChecked, setAllChecked] = useState<boolean>(false);
  //const [test, setTest] = useState<Record<string, any[]>>({})
  const [checkedState, setCheckedState] = useState<Record<string, boolean[]>>({});

  useEffect(() => {
    if (apiData) {
      const fetchData = async () => {
        try {
          const resourceLists = {};
          const packageChecks = {};
          for (const key in apiData) {
            const nyKey = key.replace("no.fint.model.", "");
            const apiTest = await MeApi.postComponent(nyKey);
            if (apiTest) {
              const resourceNames = Object.keys(apiTest).sort();
              resourceLists[key] = resourceNames;
              packageChecks[key] = false;
            }
          }
          setResources(resourceLists);
          setPackageBoxCheck(packageChecks);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [apiData]);

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

  const handlePackageCheck = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setPackageBoxCheck(prevChecks => ({ ...prevChecks, [key]: isChecked }));
    handleCheckAll();
  };

  const handleResourceCheck = (key: string, index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    console.log(isChecked, " på index ", index)
  };

  const handleCheckBoxChange = (key: string, resourceIndex: number) => {
    setCheckedState((prevState) => ({
      ...prevState,
      [key]: prevState[key].map((checked, index) =>
        index === resourceIndex ? !checked : checked
      ),
    }));
    console.log("endret ", key, " - index ", resourceIndex);
  };

  const handleCheckAll = () => {
    if (!packageBoxCheck) {
      setAllChecked(true)
    }
    else {
      setAllChecked(false)
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
              .map((key, index) => (
                <React.Fragment key={key}>
                  <Table.Row>
                    <Table.DataCell>
                      <Checkbox
                        checked={packageBoxCheck[key]}
                        onChange={handlePackageCheck(key)}
                      >
                        <Button variant="tertiary-neutral" className="expand-button" onClick={() => toggleRow(key)}>
                          {key.replace("no.fint.model.", "")}
                        </Button>
                      </Checkbox>
                    </Table.DataCell>
                  </Table.Row>
                  {expandedRows.includes(key) && resources[key] && (
                    <Table.Row>
                      <Table.DataCell colSpan={1}>
                        <CheckboxGroup
                          legend="Resources"
                          hideLegend={true}
                          size='small'
                        >
                          {resources[key].map((resourceName, resourceIndex) => (
                            <Checkbox
                              key={resourceName}
                              checked={checkedState[key] ? checkedState[key][resourceIndex] || false : false}
                              onChange={handleResourceCheck(key, resourceIndex)}
                              value={resourceIndex}
                            >
                              {resourceName}
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
        <Button variant="danger" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}