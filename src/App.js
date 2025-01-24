import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { FaTrash } from 'react-icons/fa';

function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', description: '', photo: '' });

  useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteUser = (id) => {
    axios.delete(`http://localhost:3001/users/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.description || !newUser.photo) {
      alert('Todos los campos son obligatorios.');
      return;
    }
    axios.post('http://localhost:3001/users', newUser)
      .then(response => {
        setUsers([...users, response.data]);
        setNewUser({ name: '', description: '', photo: '' });
        setShowDrawer(false);
      })
      .catch(error => console.error('Error adding user:', error));
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Agenda Previded - Mi agenda de contactos laboral</h1>
      </header>
      <h5>Aquí podrá encontrar o buscar a todos sus contactos agregados, agregar nuevos contactos y eliminar contactos no deseados.</h5>
      <div> 
      <button className="add-button" onClick={() => setShowDrawer(true)}>Agregar Contacto</button>
      </div>
      <br/>
      <input
        type="text"
        className="search-bar"
        placeholder="Buscar usuarios"
        value={searchTerm}
        onChange={handleSearch}
      />
      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td className="user-info">
                <img src={user.photo} alt={user.name} className="user-photo" />
                {user.name}
              </td>
              <td>{user.description}</td>
              <td>
              <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>
              <FaTrash />
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDrawer && (
        <div className="drawer">
          <h2>Agregar nuevo Contacto</h2>
          <input
            type="text"
            className="input-field"
            placeholder="URL Imagen de Perfil"
            value={newUser.photo}
            onChange={(e) => setNewUser({ ...newUser, photo: e.target.value })}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Nombre"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <textarea
            className="input-field"
            placeholder="Descripción"
            value={newUser.description}
            onChange={(e) => setNewUser({ ...newUser, description: e.target.value })}
          ></textarea>
          <button className="save-button" onClick={handleAddUser}>Guardar</button>
          <button className="cancel-button" onClick={() => setShowDrawer(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}
export default App;
