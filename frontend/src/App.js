import { Routes, Route, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import CategoryCard from "./Components/CategoryCard";
import CategoryPage from "./Components/CategoryPage.js";
import Footer from "./Components/Footer";
import Login from "./Components/login.jsx";
import ManageCategories from "./Components/ManageCategory.js";
import Register from "./Components/Register.js";
import "font-awesome/css/font-awesome.min.css";
import "./Styling/App.css";
import "./Styling/Header.css";
import "./Styling/Sidebar.css";
import "./Styling/CategoryCard.css";
import "./Styling/Footer.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AdminApiContainer from './Components/adminApiContainer.js';


const App = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/data');  
        const responseData = await response.json();
        setCategories(responseData);
        setFilteredCategories(responseData); // Ensure filteredCategories is also set initially
        console.log('responseData', responseData);
      } catch (error) {
        console.log('ERROR', error);
      }
    };
    fetchData();
  }, [location]);

  const onSearch = (value) => {
    const filtered = categories.filter((category) =>
      category.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  return (
    <div className="app">
      <Header onSearch={onSearch} />
      <div className="main-container">
        <Sidebar links={categories.map((category) => category.title)} />
        <Routes>
          <Route
            path="/"
            element={
              <section className="categories-grid">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category, index) => (
                    <CategoryCard
                      key={index}
                      icon={category.icon}
                      title={category.title}
                      description={category.description}
                    />
                  ))
                ) : (
                  <div className="no-cards">
                    <p className="no-cards-title">
                      There are no results that match your search.
                    </p>
                    <p className="no-cards-message">
                      Please try modifying your search to get more results.
                    </p>
                  </div>
                )}
              </section>
            }
          />
          {categories.map((category, index) => (
            <Route
              key={index}
              path={`/${category.title.toLowerCase().replace(/ /g, "-")}`}
              element={
                <CategoryPage
                  title={category.title}
                  description={category.description}
                  endpoints={category.endpoints}
                  website={category.website}
                />
              }
            />
          ))}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/manage-categories" element={<ManageCategories />} />
          <Route path="/register" element={<Register />} />
          <Route path="/adminApi" element={<AdminApiContainer />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
