import React from "react";
import { Button, Table, Search } from "@navikt/ds-react";
import { PencilIcon } from "@navikt/aksel-icons";

interface TableProps<T> {
  data: T[];
  searchItem: string;
  handleSearchChange: (value: string) => void;
  columns: { label: string; key: keyof T }[];
  renderRow: (item: T, index: number) => React.ReactNode;
}

export default function LayoutTable<T>({
  data,
  searchItem,
  handleSearchChange,
  columns,
  renderRow,
}: TableProps<T>) {
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchItem.toLowerCase())
    )
  );

  const tableContainerStyle = {
    margin: '0 auto',
    width: '69%',
    maxWidth: '1200px',
  };

  return (
    <div style={tableContainerStyle}>
      <form data-theme="dark" role="search">
        <Button  variant="primary-neutral" icon={<PencilIcon aria-hidden />}>Add new</Button>
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
              <Table.HeaderCell key={column.key} scope="col">
                {column.label}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>{filteredData.map(renderRow)}</Table.Body>
      </Table>
    </div>
  );
}