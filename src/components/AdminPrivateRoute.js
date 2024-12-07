import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

const AdminPrivateRoute = ({ component: Component, ...rest }) => {
  const { isAdminLoggedIn } = useAdminAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAdminLoggedIn() ? <Component {...props} /> : <Redirect to="/admin-login" />
      }
    />
  );
};

export default AdminPrivateRoute;
