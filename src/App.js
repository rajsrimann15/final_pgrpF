// App.js
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import DashBoard from './components/Dashboard';
import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import AdminPrivateRoute from './components/AdminPrivateRoute';
import {AdminAuthProvider} from './components/AdminAuthContext'; 
import AdminDashboard from './components/AdminDashboard';
import  AdminLogin from './components/AdminLogin';

import ViewHistory from './components/ViewHistory';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <div className='App'>
        <Router>
      <div className="app-container">
        <Header />
        <div className="content-wrapper">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <PrivateRoute path="/home" component={Home} />
            <Route path="/" exact component={Home} />
            <PrivateRoute path="/dashboard" component={DashBoard} />
            <PrivateRoute path="/viewhistory" component={ViewHistory} />
            <Route path="/admin-login" component={AdminLogin} />
            <AdminPrivateRoute path="/admin-dashboard" component={AdminDashboard} />
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
        </div>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
