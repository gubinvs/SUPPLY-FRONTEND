// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListComponent from './ListComponent/ListComponent';
import EditPriceComponent from './EditPriceComponent/EditPriceComponent.jsx';
import AuthorizationForm from './RegistrationForm/AuthorizationForm.jsx';
import RegistrationForm from './RegistrationForm/RegistrationForm.jsx';
import ApplicationPanelСustomer from "./ApplicationPanel/ApplicationPanelСustomer.jsx";
import ApplicationPanelProvider from './ApplicationPanel/ApplicationPanelProvider.jsx';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EditPriceComponent/>} />
        <Route path="/AuthorizationForm" element={<AuthorizationForm/>} />
        <Route path="/Registration" element={<RegistrationForm/>} />
        <Route path="/ApplicationPanelProvider" element={<ApplicationPanelProvider/>} />
        <Route path="/ApplicationPanelСustomer" element={<ApplicationPanelСustomer/>} />
        <Route path="/ListComponent" element={<ListComponent />} />
        <Route path='/EditPriceComponent' element={<EditPriceComponent/>} />
      </Routes>
    </Router>
  );
};

export default App;
