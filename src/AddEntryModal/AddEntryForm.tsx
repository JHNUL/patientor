import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField, DiagnosisSelection, NumberField } from "../AddPatientModal/FormField";
import { EntryType, SickLeave, HealthCheckRating, Diagnosis, Discharge } from "../types";
import { useStateValue } from "../state";

export type PossibleEntryFormValues = {
  type: EntryType;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
  healthCheckRating?: HealthCheckRating;
  employerName?: string;
  startDate?: string;
  endDate?: string;
  dischargeDate?: string;
  criteria?: string;
  sickLeave?: SickLeave;
  discharge?: Discharge;
};

interface Props {
  onSubmit: (values: PossibleEntryFormValues, entry: EntryType) => void;
  onCancel: () => void;
  entryType: EntryType;
}

export const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel, entryType }) => {

  const [{ diagnoses },] = useStateValue();

  const getFormikValidationRules = (values: PossibleEntryFormValues): { [field: string]: string } => {
    const requiredError = "Field is required";
    const sickLeaveError = "Start and end date are required";
    const errors: { [field: string]: string } = {};

    if (!values.description) {
      errors.description = requiredError;
    }
    if (!values.specialist) {
      errors.specialist = requiredError;
    }
    if (!values.date) {
      errors.date = requiredError;
    }

    switch (entryType) {
      case EntryType.healthCheck: {
        if (!values.healthCheckRating) {
          errors.healthCheckRating = requiredError;
        }
        break;
      }
      case EntryType.occupationalHealthcare: {
        if (!values.employerName) {
          errors.employerName = requiredError;
        }
        const isInvalidSickLeave = !((values.startDate && values.endDate)
          || (!values.startDate && !values.endDate));
        if (isInvalidSickLeave) {
          errors.startDate = sickLeaveError;
          errors.endDate = sickLeaveError;
        }
        break;
      }
      case EntryType.hospital: {
        if (!values.dischargeDate) {
          errors.dischargeDate = requiredError;
        }
        if (!values.criteria) {
          errors.criteria = requiredError;
        }
        break;
      }
    }

    return errors;
  };

  return (
    <Formik
      initialValues={{
        description: "",
        specialist: "",
        date: "",
        type: entryType,
        diagnosisCodes: undefined,
        healthCheckRating: HealthCheckRating.CriticalRisk,
        employerName: "",
        startDate: "",
        endDate: "",
        dischargeDate: "",
        criteria: ""
      }}
      onSubmit={values => onSubmit(values, entryType)}
      validate={getFormikValidationRules}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            {entryType === EntryType.healthCheck && <Field
              label="healthCheckRating"
              name="healthCheckRating"
              component={NumberField}
              min={0}
              max={3}
            />}
            {entryType === EntryType.occupationalHealthcare && <Field
              label="Employer Name"
              placeholder="Employer Name"
              name="employerName"
              component={TextField}
            />}
            {entryType === EntryType.occupationalHealthcare && <Field
              label="Sick leave start date"
              placeholder="YYYY-MM-DD"
              name="startDate"
              component={TextField}
            />}
            {entryType === EntryType.occupationalHealthcare && <Field
              label="Sick leave end date"
              placeholder="YYYY-MM-DD"
              name="endDate"
              component={TextField}
            />}
            {entryType === EntryType.hospital && <Field
              label="Discharge date"
              placeholder="YYYY-MM-DD"
              name="dischargeDate"
              component={TextField}
            />}
            {entryType === EntryType.hospital && <Field
              label="Discharge criteria"
              placeholder="Criteria"
              name="criteria"
              component={TextField}
            />}
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
