export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3,
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum EntryType {
  healthCheck = 'HealthCheck',
  occupationalHealthcare = 'OccupationalHealthcare',
  hospital = 'Hospital'
}

export interface HealthCheckEntry extends BaseEntry {
  type: EntryType.healthCheck;
  healthCheckRating: HealthCheckRating;
}

export interface SickLeave {
  startDate: string;
  endDate: string;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.occupationalHealthcare;
  employerName: string;
  sickLeave?: SickLeave;
}

export interface Discharge {
  date: string;
  criteria: string;
}

export interface HospitalEntry extends BaseEntry {
  type: EntryType.hospital;
  discharge: Discharge;
}

export type Entry =
  | OccupationalHealthcareEntry
  | HealthCheckEntry
  | HospitalEntry;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn: string;
  dateOfBirth: string;
  entries: Array<Entry>;
}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}
