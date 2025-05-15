import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Votaciones.module.css';
import logo from './logo.jpg';

function Votaciones() {
  const [selectedGame, setSelectedGame] = useState(null);

  const selectGame = (id) => {
    setSelectedGame(id);
  };

  const confirmVote = () => {
    if (selectedGame) {
      alert(`¡Voto registrado para el juego con ID: ${selectedGame}!`);
    } else {
      alert('Por favor, selecciona un juego antes de votar.');
    }
  };

  return (
    <div className={styles.body}>
      <title>Votación - ALDD Awards</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />

      <nav className="navbar navbar-dark bg-dark navbar-expand-lg sticky-top">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="Logo" width="80" height="40" className="me-2" />
            ALDD Awards
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Inicio</Link>
              </li>
             <li className="nav-item">
                 <Link className="nav-link" to="/Categorias">Categorias</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Perfil">Perfil</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className={`container ${styles['container-vote']}`}>
        <h2 className="mb-4">Mejor Juego Del Siglo XXI</h2>
        <div className="row">
          {[
            { id: 'game1', title: 'FIFA 23', img: 'https://th.bing.com/th/id/OIP.SyNrRI3NwrKLhA2xmiSXRgHaLH?rs=1&pid=ImgDetMain' },
            { id: 'game2', title: 'Bioshock', img: 'https://cdn.alfabetajuega.com/alfabetajuega/abj_public_files/multimedia/imagenes/201212/26876.portada2.jpg' },
            { id: 'game3', title: 'Gears 2', img: 'https://th.bing.com/th/id/OIP.ZbKD1apw61y7G3c_96XwkwHaJb?rs=1&pid=ImgDetMain' },
            { id: 'game4', title: 'Halo Infinite', img: 'https://th.bing.com/th/id/OIP.zVg0oBWuVCUIM4Kqx77hLgHaHa?rs=1&pid=ImgDetMain' },
            { id: 'game5', title: 'Spiderman', img: 'https://www.mundogamers.com/cdn/covers/big/ps5/marvels-spider-man-remastered.jpg' },
            { id: 'game6', title: 'Smash Ultimate', img: 'https://th.bing.com/th/id/OIP.SfLNTsycT1pfcABFk78u9wHaMC?rs=1&pid=ImgDetMain' }
          ].map(game => (
            <div key={game.id} className="col-md-4 mt-4">
              <div
                className={styles['game-card']}
                onClick={() => selectGame(game.id)}
                style={{ border: selectedGame === game.id ? '2px solid #b8860b' : 'none' }}
              >
                <img src={game.img} className="img-fluid" alt={game.title} />
                <h4 className="mt-2">{game.title}</h4>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-warning mt-4" onClick={confirmVote}>Realizar voto</button>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2025 ALDD Awards. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Votaciones;
