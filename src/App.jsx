import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListComponent from './ListComponent/ListComponent';
import AuthorizationForm from './RegistrationForm/AuthorizationForm.jsx';
import RegistrationForm from './RegistrationForm/RegistrationForm.jsx';
import ApplicationPanelСharterer from "./ApplicationPanel/ApplicationPanelСharterer.jsx";
import ApplicationPanelProvider from './ApplicationPanel/ApplicationPanelProvider.jsx';
import ApplicationPanelAdmin from './ApplicationPanel/ApplicationPanelAdmin.jsx';
import PrivateRoute from './js/PrivateRoute.jsx'; // добавили данные о роли пользователя
import UpdatePassword from "./RegistrationForm/UpdatePassword.jsx";
import ApplicationPanelRouter from "./ApplicationPanel/ApplicationPanelRouter.jsx";

// Константы ролей
const ROLE_ADMIN = "b5aff5b0-c3ac-4f1e-9467-fe13a14f6de3"; // Роль администратора системы
const ROLE_PROVIDER = "a5219e2b-12f3-490e-99f5-1be54c55cc6d"; // Роль поставщика
const ROLE_CUSTOMER = "52910536-2b8a-47e7-9d5a-8cca0a0b865a"; // Роль заказчика

const App = () => {

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<EditPriceComponent />} /> */}
        <Route path="/" element={<ApplicationPanelRouter />} />
        <Route path="/AuthorizationForm" element={<AuthorizationForm />} />
        <Route path="/Registration" element={<RegistrationForm />} />
        <Route path="/UpdatePassword" element={<UpdatePassword />} />

        <Route path="/ListComponent" element={
          <PrivateRoute allowedRoles={[ROLE_ADMIN]}>
            <ListComponent />
          </PrivateRoute>} />

        <Route path="/ApplicationPanelAdmin" element={
          <PrivateRoute allowedRoles={[ROLE_ADMIN]}>
            <ApplicationPanelAdmin />
          </PrivateRoute>
        } />

        <Route path="/ApplicationPanelProvider" element={
          <PrivateRoute allowedRoles={[ROLE_PROVIDER, ROLE_ADMIN]}>
            <ApplicationPanelProvider />
          </PrivateRoute>
        } />

        <Route path="/ApplicationPanelСharterer" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_ADMIN]}>
            <ApplicationPanelСharterer />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;


