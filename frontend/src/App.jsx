import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Provider store={store}>
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </Provider>
  );
}

export default App;
