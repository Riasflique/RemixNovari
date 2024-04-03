import React from 'react';
import { Modal, Button, TextField, BodyLong } from '@navikt/ds-react';
import { persData, PersType } from '~/routes/_person';

type EditPersonModalProps = {
  isOpen: boolean;
  person: PersType | null;
  onSave: (person: PersType) => void;
  onClose: () => void;
};

const EditPersonModal: React.FC<EditPersonModalProps> = ({ isOpen, person, onSave, onClose }) => {
  const [editingPerson, setEditingPerson] = React.useState<PersType | null>(null);

  React.useEffect(() => {
    setEditingPerson(person);
  }, [person]);

  const handleChange = (field: keyof PersType, value: string) => {
    if (editingPerson) {
      setEditingPerson({ ...editingPerson, [field]: value });
    }
  };

  const handleSave = () => {
    if (editingPerson) {
      onSave(editingPerson);
      setEditingPerson(null); // Reset editingPerson state after saving
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} header={{ heading: 'Rediger' }}>
      <Modal.Body>
        <BodyLong>
          <TextField label="Navn" value={editingPerson?.fname || ''} onChange={(e) => handleChange('fname', e.target.value)}/>
          <TextField label="Etternavn" value={editingPerson?.lname || ''} onChange={(e) => handleChange('lname', e.target.value)}/>
          <TextField label="E-Post" value={editingPerson?.email || ''} onChange={(e) => handleChange('email', e.target.value)}/>
          <TextField label="Telefon" value={editingPerson?.phone || ''} onChange={(e) => handleChange('phone', e.target.value)}/>
        </BodyLong>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Avbryt</Button>
        <Button onClick={handleSave}>Lagre</Button>
      </Modal.Footer>
    </Modal>
  );
};


export default EditPersonModal;
