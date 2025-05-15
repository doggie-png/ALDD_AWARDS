import React from 'react';
import { Link } from 'react-router-dom';
import styles from './EditarPerfil.module.css';
import logo from './logo.jpg';

function EditarPerfil() {
  return (
    <div className={styles.body}>
      <title>Editar-Perfil - ALDD Awards</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
      
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg sticky-top">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="Logo" width="80" height="40" className="me-2" />
            ALDD Awards
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Perfil">Perfil</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className={`container ${styles['profile-container']}`}>
        <h2 className="mb-4">Ver Datos - Editar Perfil</h2>
        <form>
          <div className="form-group text-start">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" className="form-control" id="nombre" placeholder="Nombre" />
          </div>
          <div className="form-group text-start">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" className="form-control" id="email" placeholder="Correo" />
          </div>
          <div className="form-group text-start">
            <label htmlFor="password">Contraseña</label>
            <input type="password" className="form-control" id="password" placeholder="Contraseña" />
          </div>
          <button type="submit" className="btn btn-warning mt-3">Guardar Cambios</button>
        </form>
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2025 ALDD Awards. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default EditarPerfil;
