import React, { useState } from 'react';
import { Modal, Segment, Button } from 'semantic-ui-react';
import AddEntryForm, { PossibleEntryFormValues } from './AddEntryForm';
import { EntryType } from '../types';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PossibleEntryFormValues, entry: EntryType) => void;
  error?: string;
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => {
  
  const [ type, setType ] = useState<EntryType>(EntryType.healthCheck);
  
  return (
    <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
      <Modal.Header>Add a new entry</Modal.Header>
      <Button.Group>
        <Button onClick={() => setType(EntryType.healthCheck)}>Health check</Button>
        <Button onClick={() => setType(EntryType.occupationalHealthcare)}>Occupational check</Button>
        <Button onClick={() => setType(EntryType.hospital)}>Hospital</Button>
      </Button.Group>
      <Modal.Content>
        {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
        <AddEntryForm onSubmit={onSubmit} onCancel={onClose} entryType={type} />
      </Modal.Content>
    </Modal>
  );
};

export default AddEntryModal;
