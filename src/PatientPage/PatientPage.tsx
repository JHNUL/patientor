import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Header, Container, Icon, Button } from 'semantic-ui-react';
import { apiBaseUrl } from '../constants';
import { Patient, Entry, EntryType } from '../types';
import { useStateValue, addPatient } from '../state';
import PatientEntry from './PatientEntry';
import AddEntryModal from '../AddEntryModal';
import { PossibleEntryFormValues } from '../AddEntryModal/AddEntryForm';

const PatientPage: React.FC = () => {

  const { id } = useParams<{ id: string }>();
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const patient: Patient = patients[id];

  useEffect(() => {
    const fetchPatientInfo = async (id: string) => {
      try {
        const { data: patient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        dispatch(addPatient(patient));
      } catch (error) {
        console.error(error);
      }
    };
    if (!patient) fetchPatientInfo(id);
  }, [dispatch, id, patient]);

  if (!patient || !Object.keys(diagnoses).length) {
    return null;
  }

  const openModal = (): void => setModalOpen(true);
  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: PossibleEntryFormValues, entry: EntryType) => {
    if (entry === EntryType.occupationalHealthcare) {
      if (values.startDate && values.endDate) {
        values.sickLeave = {
          startDate: values.startDate,
          endDate: values.endDate
        };
      }
    }
    if (entry === EntryType.hospital) {
      if (values.dischargeDate && values.criteria) {
        values.discharge = {
          date: values.dischargeDate,
          criteria: values.criteria
        };
      }
    }
    values.type = entry;
    try {
      const { data: newPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addPatient(newPatient));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  const renderIcon = (patient: Patient) => {
    switch (patient.gender) {
      case 'male': {
        return (<Icon name='mars' />);
      }
      case 'female': {
        return (<Icon name='venus' />);
      }
      default: {
        return (<Icon name='other gender' />);
      }
    }
  };

  return (
    <Container>
      <Header as='h2'>{patient.name}{' '}{renderIcon(patient)}</Header>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
      <Header as='h3'>Entries</Header>
      {patient.entries.map((e: Entry) => (<PatientEntry key={e.id} entry={e} />))}
    </Container>
  );

};

export default PatientPage;
