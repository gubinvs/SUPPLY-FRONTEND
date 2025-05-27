// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListComponent from './ListComponent/ListComponent';
import EditPriceComponent from './EditPriceComponent/EditPriceComponent.jsx'



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListComponent />} />
        <Route path='/EditPriceComponent' element={<EditPriceComponent/>} />
      </Routes>
    </Router>
  );
};

export default App;
