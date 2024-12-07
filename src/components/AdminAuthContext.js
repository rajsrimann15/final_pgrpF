import React, { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem('admin');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  const adminLogin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData)); // Store admin data in localStorage
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('admin'); // Remove admin data from localStorage
  };

  const isAdminLoggedIn = () => !!admin;

  return (
    <AdminAuthContext.Provider value={{ admin, adminLogin, adminLogout, isAdminLoggedIn }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  return useContext(AdminAuthContext);
};

export default AdminAuthContext;
