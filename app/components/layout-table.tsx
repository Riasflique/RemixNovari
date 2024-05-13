import React, { useState } from "react";
import { Button, Table, Search, Heading } from "@navikt/ds-react";
import { PencilIcon } from "@navikt/aksel-icons";
import AddnewLayoutTable from "./layout-addnew";
import { PersType } from "~/routes/person";
import { getPersData } from '~/routes/person';

interface TableProps<T> {
  data: T[];
  searchItem: string;
  handleSearchChange: (value: string) => void;
  columns: { label: string; key: keyof T }[];
  renderRow: (item: T, index: number) => React.ReactNode;
  tableType: "Clients" | "Organizations";
}
async function useData() {
  const persData = await getPersData();
  console.log(persData);
}
useData();


export default function LayoutTable<T extends Record<string, any>>({
  data,
  searchItem,
  handleSearchChange,
  columns,
  renderRow,
  tableType,
}: TableProps<T>) {

  const [persons, setPersons] = useState<PersType[]>(persData);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleAddNewModal = () => {
    setIsAddingNew(!isAddingNew)
  };
  const toggleOffNewModal = () => {
    setIsModalOpen(true);
  }

  const handleSaveNewPerson = (newPerson: PersType) => {
    setPersons([...persons, newPerson]);
    toggleAddNewModal();
  };

  console.log("Received data in LayoutTable:", data); 
  const filteredData = Array.isArray(data) ? data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchItem.toLowerCase())
    )
  ) : [];

  const tableContainerStyle = {
    margin: '0 auto',
    width: '69%',
    maxWidth: '1200px',
  };

  return (
    <div style={tableContainerStyle}>
      <Heading size="xlarge">{tableType}</Heading> {/* Render dynamic heading text */}
      <form data-theme="dark" role="search">
        <Button variant="primary-neutral" icon={<PencilIcon aria-hidden />} onClick={toggleAddNewModal} type="button">Add new</Button>
        <Search
          label="Søk"
          placeholder="Search"
          variant="simple"
          htmlSize="16"
          onChange={handleSearchChange}
          value={searchItem}
        />
      </form>
      <Table zebraStripes>
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.HeaderCell key={String(column.key)} scope="col">
                {column.label}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>{filteredData.map(renderRow)}</Table.Body>
      </Table>
      <AddnewLayoutTable
        isOpen={isAddingNew}
        onClose={toggleOffNewModal}
        onSave={handleSaveNewPerson}
      />
    </div>
  );
}
