// App.js
import React from "react";
import Generate from "./components/Generate";
import AllExercice from "./components/AllExercice";
import { BrowserRouter, Route, Routes } from "react-router";

function App () {
  return (
    <BrowserRouter>

      <Routes>
          <Route path="/" element={<AllExercice />} />
          <Route path="/generate" element={<Generate />} />
      </Routes>
    </BrowserRouter>

  );
};

export default App;