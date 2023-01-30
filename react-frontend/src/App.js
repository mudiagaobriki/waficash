import logo from './logo.svg';
import './App.scss';
import Navigation from './components/Navigation';
import Dashboard from './screens/Dashboard';
import Deposit from './screens/Deposit';
import Transfer from './screens/Transfer';
import { Container } from "reactstrap";
import { useState } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState("Users")

  const selectPage = (page) => {
    setCurrentPage(page)
  };

  return (
    <Container fluid={true}>
      <Navigation selectPage={selectPage} />
      {currentPage === "Users" && <Dashboard />}
      {currentPage === "Deposit" && <Deposit />}
      {currentPage === "Transfers" && <Transfer />}
    </Container>
  );
}

export default App;
