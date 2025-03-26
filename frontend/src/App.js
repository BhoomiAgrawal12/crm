import './App.css';
import SideNav from './components/SideNav';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="container">
      <div className="container-1">
        <SideNav />
      </div>
      <div className="container-2"><Dashboard /></div>
    </div>
  );
}

export default App;
