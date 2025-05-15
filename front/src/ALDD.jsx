import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ALDD.module.css';
import logo from './logo.jpg';

function ALDD() {
  const navigate = useNavigate();

  return (
    <div className={styles.body}>
    <title>ALDD Awards</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"></link>
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg sticky-top">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="Logo" width="80" height="40" className="me-2" />
            ALDD Awards
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Votaciones">Votaciones</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Categorias">Categorias</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Perfil">Perfil</Link>
              </li>
            </ul>
            <button className="btn btn-warning ms-3" data-bs-toggle="modal" data-bs-target="#authModal">
              Iniciar sesión / Registrarse
            </button>
          </div>
        </div>
      </nav>

      <header className={styles.hero}>
        <h1 className="display-4">Vota por tu videojuego favorito</h1>
        <p className="lead">Únete a la comunidad y elige a los ganadores de este año</p>
        <a href="#votar" className="btn btn-warning btn-lg">¡Descubre Ahora!</a>
      </header>

      <section className={`container ${styles.nominees}`} id="votar">
        <h2 className="mb-4">Categorías</h2>
        <div className="row">
          {[
            { title: "Juego Del Año" },
            { title: "Mejor Dirección De Juego" },
            { title: "Mejor Narrativa de Juego" }
          ].map((item, index) => (
            <div key={index} className="col-md-4">
              <div className={styles['game-card']}>
                <img
                  src="https://png.pngtree.com/thumb_back/fh260/background/20210901/pngtree-luxury-golden-shield-award-ceremony-background-image_774496.jpg"
                  className="img-fluid"
                  alt={item.title}
                />
                <h4 className="mt-2">{item.title}</h4>
                <button className="btn btn-warning mt-2" onClick={() => navigate('/Categorias')}>
                  Ver Categorias
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2025 ALDD Awards. Todos los derechos reservados.</p>
      </footer>

      {/* Modal */}
      <div className="modal fade" id="authModal" tabIndex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content text-dark">
            <div className="modal-header">
              <h5 className="modal-title" id="authModalLabel">Iniciar sesión / Registrarse</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              <form>
                <input className="form-control mb-2" type="text" placeholder="Nombre" required />
                <input className="form-control mb-2" type="email" placeholder="Correo" required />
                <input className="form-control mb-2" type="password" placeholder="Contraseña" required />
                <button className="btn btn-warning w-100" type="submit">Confirmar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ALDD;
