import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Button, Divider, Header, Container } from "semantic-ui-react";

import { apiBaseUrl } from "./constants";
import { useStateValue, setPatientList, setDiagnoses } from "./state";
import { Patient, Diagnosis } from "./types";

import PatientListPage from "./PatientListPage";
import PatientPage from "./PatientPage/PatientPage";

const App: React.FC = () => {
  const [, dispatch] = useStateValue();
  // runs after render, so PatientPage sends requests first if bookmarking /:id route
  React.useEffect(() => {
    axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientsAndDiagnoses = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
        const { data: diagnoseListFromApi } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch(setPatientList(patientListFromApi));
        dispatch(setDiagnoses(diagnoseListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatientsAndDiagnoses();
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Container>
          <Header as="h1">Patientor</Header>
          <Button as={Link} to="/" primary>
            Home
          </Button>
          <Divider hidden/>
          <Switch>
            <Route path="/" exact render={() => <PatientListPage />} />
            <Route path="/:id">
              <PatientPage />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;
