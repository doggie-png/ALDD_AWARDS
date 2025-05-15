import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Perfil.module.css';
import logo from './logo.jpg';

function Perfil() {
  return (
    <div className={styles.body}>
    <title>Perfil - ALDD Awards</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"/>
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
                <Link className="nav-link" to="/Votaciones">Votaciones</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/EditarPerfil">Editar</Link>
              </li>
            </ul>
            <button className="btn btn-warning ms-3" data-bs-toggle="modal" data-bs-target="#authModal">
            Agregar Juegos
            </button>
          </div>
        </div>
      </nav>

      <div className={`container ${styles['profile-container']}`}>
        <img
          src="https://th.bing.com/th/id/OIP._qSKWYY_8MMeUZCoX-U7uAHaHa?rs=1&pid=ImgDetMain"
          alt="Imagen de usuario"
          className={styles['profile-img']}
        />
        <h2 className="mt-3">Nombre del Usuario</h2>

        <div className={styles.options}>
          <button className="btn btn-warning">Juegos en progreso</button>
          <button className="btn btn-warning">Juegos terminados</button>
          <button className="btn btn-warning">Juegos que me gustan</button>
          <button className="btn btn-warning">Juegos que no me gustan</button>
        </div>
      </div>
      <footer className={styles.footer}>
        <p>&copy; 2025 ALDD Awards. Todos los derechos reservados.</p>
      </footer>

      {/* Modal */}
      <div className="modal fade" id="authModal" tabIndex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content text-dark">
            <div className="modal-header">
              <h5 className="modal-title" id="authModalLabel">Agregar Juego a una de tus Categoría</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              <form>
                <input className="form-control mb-2" type="text" placeholder="Id Juego" required />
                <button className="btn btn-warning w-100" type="submit">Confirmar</button>
                <label htmlFor="categorySelect" className="form-label">Seleccionar Categoría</label>
  <select>
    <option value="">-- Selecciona una opción --</option>
    <option value="inProgress">Juegos en Progreso</option>
    <option value="completed">Juegos Terminados</option>
    <option value="liked">Juegos que me Gustan</option>
    <option value="disliked">Juegos que no me Gustan</option>
    </select>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Perfil;
