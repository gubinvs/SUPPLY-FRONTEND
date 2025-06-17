import {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApiUrl from "./js/ApiUrl.js";
import ListComponent from './ListComponent/ListComponent';
import AuthorizationForm from './RegistrationForm/AuthorizationForm.jsx';
import RegistrationForm from './RegistrationForm/RegistrationForm.jsx';
import ApplicationPanelCustomer from "./ApplicationPanel/ApplicationPanelCustomer.jsx";
import ApplicationPanelProvider from './ApplicationPanel/ApplicationPanelProvider.jsx';
import ApplicationPanelAdmin from './ApplicationPanel/ApplicationPanelAdmin.jsx';
import PrivateRoute from './js/PrivateRoute.jsx'; // добавили данные о роли пользователя
import UpdatePassword from "./RegistrationForm/UpdatePassword.jsx";
import ApplicationPanelRouter from "./ApplicationPanel/ApplicationPanelRouter.jsx";
import { roleMap } from "./js/roleMap.js";
import SuppliersOffers from "./SuppliersOffers/SuppliersOffers.jsx";
import AllOffersForSelected from "./SuppliersOffers/AllOffersForSelected.jsx";
import AddComponentApplication from "./AddComponentApplication/AddComponentApplication.jsx";
import ExcelPasteInput from "./ExcelPasteInput.jsx";

// Константы ролей пользователей
const ROLE_ADMIN = "b5aff5b0-c3ac-4f1e-9467-fe13a14f6de3"; // Роль администратора системы
const ROLE_PROVIDER = "a5219e2b-12f3-490e-99f5-1be54c55cc6d"; // Роль поставщика
const ROLE_CUSTOMER = "52910536-2b8a-47e7-9d5a-8cca0a0b865a"; // Роль заказчика


const App = () => {
  const [roleId] = useState(() => localStorage.getItem("roleId")); // ✅ кэшируем значение
  const [role, setRole] = useState("");
  const [title, setTitle] = useState("");

  const [components, setComponents] = useState([]);
  const [error, setError] = useState(null);



  useEffect(() => {
      const currentRole = roleMap[roleId] || "Неизвестная роль";
      setRole(currentRole);
  }, [roleId]);

  useEffect(() => {
      const location = window.location.pathname;
      
      setTitle(location === "/ApplicationPanelCustomer"
          ? "Информационная панель"
          : "");
  }, []);


  // Запрос полного списка номенклатуры в базе данных
    useEffect(() => {
        fetch(ApiUrl + "/api/ReturnListDataComponent", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                setComponents(data.component || []);
            })
            .catch((error) => {
                console.error("Ошибка получения данных:", error);
                setError("Ошибка загрузки данных: " + error.message);
            });
    }, []);


  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<EditPriceComponent />} /> */}
        <Route path="/" element={<ApplicationPanelRouter />} />
        <Route path="/AuthorizationForm" element={<AuthorizationForm />} />
        <Route path="/Registration" element={<RegistrationForm />} />
        <Route path="/UpdatePassword" element={<UpdatePassword />} />
        <Route path='/ExcelPasteInput' element={<ExcelPasteInput />} />

        {/* Роут первоначальный для упрошенного отображения, работает пока не введено новое приложение, потом удалить */}
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

        <Route path="/ApplicationPanelCustomer" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_ADMIN]}>
            <ApplicationPanelCustomer role={role} title={title} />
          </PrivateRoute>
        } />

        {/* Страница c формой добавления компонентов в систему */}
        <Route path="/AddComponentApplication" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_PROVIDER, ROLE_ADMIN]}>
            <AddComponentApplication 
              role={role} 
              title="Добавление нового артикула в базу данных"
              components={components} 
            />
          
          </PrivateRoute>
        } />

        {/* Страница для заказчика, на ней посковая строка и выдача результатов всех предложеий */}
        <Route path="/SuppliersOffers" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_ADMIN]}>
            <SuppliersOffers 
              role={role} 
              title="Предложения поставщиков" 
              components={components}
              error={error}
            />
          </PrivateRoute>
        } />

        {/* Страница для заказчика, на ней посковая строка и выдача результатов по лучшим предложениям */}
        <Route path="/AllOffersForSelected" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_ADMIN]}>
            <AllOffersForSelected role={role} title="Предложения по выбранным артикулам" />
          </PrivateRoute>
        } />

      </Routes>
    </Router>
  );
};

export default App;