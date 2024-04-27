import React, { useState } from "react";
import { Button, Table, Search, Modal, TextField } from "@navikt/ds-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<any>({
    fname: "",
    lname: "",
    email: "",
    phone: "",
  });

  const handleOpen = () => {
    setIsOpen(true);
    setEditingPerson({ //har bare tomme strings atm siden det er add new
      fname: "",
      lname: "",
      email: "",
      phone: "",
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (key: string, value: string) => {
    setEditingPerson({ ...editingPerson, [key]: value });
  };

  const handleSave = () => { //antar vi må ha noe kode her med API???
    setIsOpen(false);
  };

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
      <Button variant="primary-neutral" icon={<PencilIcon aria-hidden />} onClick={handleOpen}>
        Add new
      </Button>
      <form data-theme="dark" role="search"> 
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

      <Modal open={isOpen} onClose={handleClose} header={{ heading: 'Add new' }}>
        <Modal.Body>
          <TextField label="Navn" value={editingPerson.fname} onChange={(e) => handleChange('fname', e.target.value)}/>
          <TextField label="Etternavn" value={editingPerson.lname} onChange={(e) => handleChange('lname', e.target.value)}/>
          <TextField label="E-Post" value={editingPerson.email} onChange={(e) => handleChange('email', e.target.value)}/>
          <TextField label="Telefon" value={editingPerson.phone} onChange={(e) => handleChange('phone', e.target.value)}/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Avbryt</Button>
          <Button onClick={handleSave}>Lagre</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
