import React from 'react';
import { Segment, Header, Icon } from 'semantic-ui-react';
import { Entry, EntryType } from '../types';
import { assertNever } from '../util';
import { useStateValue } from '../state';

interface PatientEntryProps {
  entry: Entry;
}

type iconColors = | 'green' | 'orange' | 'violet' | 'red';

const PatientEntry: React.FC<PatientEntryProps> = ({ entry }) => {

  const [{ diagnoses },] = useStateValue();
  const iconColors: Array<iconColors> = ['green', 'orange', 'violet', 'red'];

  const renderEntry = (e: Entry) => {
    switch (e.type) {
      case EntryType.occupationalHealthcare: {
        return (
          <>
            <Header as='h3'>
              {e.date}{' '}<Icon name='stethoscope' />{' '}{e.employerName}
            </Header>
            <div><em>{e.description}</em></div>
            {e.sickLeave && <div>On leave: {e.sickLeave.startDate} to {e.sickLeave.endDate}</div>}
          </>
        );
      }
      case EntryType.healthCheck: {

        return (
          <>
            <Header as='h3'>
              {e.date}{' '}<Icon name='doctor' />
            </Header>
            <div><em>{e.description}</em></div>
            <Icon name='heart' color={iconColors[e.healthCheckRating]} />
          </>
        );
      }
      case EntryType.hospital: {
        return (
          <>
            <Header as='h3'>
              {e.date}{' '}<Icon name='emergency' />
            </Header>
            <div><em>{e.description}</em></div>
            <div>Discharged: {e.discharge.date} on criteria {e.discharge.criteria}</div>
          </>
        );
      }
      default:
        return assertNever(e);
    }
  };

  return (
    <Segment>
      {renderEntry(entry)}
      <ul>{entry.diagnosisCodes?.map(dg => (<li key={dg}>{dg} {diagnoses[dg]?.name}</li>))}</ul>
    </Segment>
  );

};

export default PatientEntry;
