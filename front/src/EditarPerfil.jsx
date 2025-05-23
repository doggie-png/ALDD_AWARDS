import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './EditarPerfil.module.css';
import logo from './logo.jpg';

function EditarPerfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    mail: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(savedUser);
    setUser(userData);

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8080/users/user/${userData.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (response.ok && result.data) {
          console.log('Received user data:', JSON.stringify(result.data, null, 2));
          setFormData({
            name: result.data.name || '',
            mail: result.data.mail || '',
            password: '',
          });
        } else {
          setMessage('Error al cargar los datos del usuario');
        }
      } catch (error) {
        console.error('Error al conectar:', error);
        setMessage('Error al conectar con el servidor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('Debes iniciar sesión para editar tu perfil');
      return;
    }

    // Validate that at least one field is provided
    if (!formData.name && !formData.mail && !formData.password) {
      setMessage('Debes proporcionar al menos un campo para actualizar');
      return;
    }

    // Validate password length if provided
    if (formData.password && formData.password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setIsLoading(true);
      const updateData = {};
      if (formData.name) updateData.name = formData.name;
      if (formData.mail) updateData.mail = formData.mail;
      if (formData.password) updateData.password = formData.password;

      const response = await fetch(`http://localhost:8080/users/user/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Perfil actualizado correctamente');
        // Update localStorage with new user data
        const updatedUser = { ...user, ...data.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setFormData((prev) => ({ ...prev, password: '' })); // Clear password field
      } else {
        setMessage(`Error: ${data.message || 'No se pudo actualizar el perfil'}`);
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setMessage('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className={styles.body}>
      <title>Editar Perfil - ALDD Awards</title>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      />

      <nav className="navbar navbar-dark bg-dark navbar-expand-lg sticky-top">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="Logo" width="80" height="40" className="me-2" />
            ALDD Awards
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Perfil">
                  Perfil
                </Link>
              </li>
            </ul>
            <button
              className="btn btn-danger ms-3"
              onClick={handleLogout}
              disabled={isLoading}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className={`container ${styles['profile-container']}`}>
        {isLoading && (
          <div className="text-center my-3">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        )}
        <h2 className="mb-4">Editar Perfil</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group text-start mb-3">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre"
              disabled={isLoading}
            />
          </div>
          <div className="form-group text-start mb-3">
            <label htmlFor="mail">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              id="mail"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              placeholder="Correo"
              disabled={isLoading}
            />
          </div>
          <div className="form-group text-start mb-3">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nueva contraseña"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-warning mt-3"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
        {message && (
          <div className="alert alert-info mt-3" role="alert">
            {message}
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <p>© 2025 ALDD Awards. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default EditarPerfil;