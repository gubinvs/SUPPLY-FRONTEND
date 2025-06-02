// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListComponent from './ListComponent/ListComponent';
import EditPriceComponent from './EditPriceComponent/EditPriceComponent.jsx';
import AuthorizationForm from './RegistrationForm/AuthorizationForm.jsx';
import RegistrationForm from './RegistrationForm/RegistrationForm.jsx';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/AuthorizationForm" element={<AuthorizationForm/>} />
        <Route path="/Registration" element={<RegistrationForm/>} />
        <Route path="/" element={<EditPriceComponent/>} />
        <Route path="/ListComponent" element={<ListComponent />} />
        <Route path='/EditPriceComponent' element={<EditPriceComponent/>} />
      </Routes>
    </Router>
  );
};

export default App;
