// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListComponent from './ListComponent/ListComponent';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
