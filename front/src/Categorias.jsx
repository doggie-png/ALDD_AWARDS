import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Categorias.module.css';
import logo from './logo.jpg';

function Categorias() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const fetchTopGames = async () => {
      try {
        // Fetch existing top games
        const topGamesResponse = await fetch('http://localhost:8080/topGames/all');
        if (!topGamesResponse.ok) {
          throw new Error('Error al obtener los juegos principales');
        }
        const topGamesData = await topGamesResponse.json();

        // Fetch GOTY games
        const gotyResponse = await fetch('http://localhost:8080/votaciones/goty');
        if (!gotyResponse.ok) {
          throw new Error('Error al obtener los juegos GOTY');
        }
        const gotyData = await gotyResponse.json();

        if (topGamesData.success) {
          // Mapear los datos de la API a la estructura de categorias
          const mappedCategorias = [
            {
              titulo: 'Juegos Más Gustados',
              juegos: topGamesData.topLiked.map(game => ({
                nombre: game.gameId.title,
                imagen: game.gameId.image
              })).slice(0, 4)
            },
            {
              titulo: 'Juegos Menos Gustados',
              juegos: topGamesData.topDisliked.map(game => ({
                nombre: game.gameId.title,
                imagen: game.gameId.image
              })).slice(0, 4)
            },
            {
              titulo: 'Juegos Más Votados',
              juegos: topGamesData.topVoted.map(game => ({
                nombre: game.gameId.title,
                imagen: game.gameId.image
              })).slice(0, 4)
            },
            {
              titulo: 'Mayor Tasa de Finalización',
              juegos: topGamesData.topCompletionRate.map(game => ({
                nombre: game.gameId.title,
                imagen: game.gameId.image
              })).slice(0, 4)
            },
            {
              titulo: 'Mejor Juego de Usuarios | Best Game of Users',
              juegos: gotyData.map(game => ({
                nombre: game.title,
                imagen: game.img
              })).slice(0, 4)
            }
          ];
          setCategorias(mappedCategorias);
        } else {
          throw new Error(topGamesData.message || 'Error en la respuesta de la API');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopGames();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className={styles.body}>
      <title>ALDD Awards</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
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
                <Link className="nav-link" to="/Perfil">Perfil</Link>
              </li>
            </ul>
            {user ? (
              <div className="d-flex align-items-center ms-3">
                <span className="text-white me-3">Hola, {user.name}</span>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </nav>
      <div className={`container ${styles['container-vote']}`}>
        <h2 className={styles['shiny-title']}>Top Votos</h2>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando categorías...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center" role="alert">
            {error}. Por favor, intenta de nuevo más tarde.
          </div>
        ) : (
          categorias.map((categoria, idx) => (
            <section key={idx} className="mb-5">
              <h3 className="text-warning mb-4">{categoria.titulo}</h3>
              <div className="row">
                {categoria.juegos.map((juego, i) => (
                  <div key={i} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div className={styles['game-card']}>
                      <img src={juego.imagen} alt={juego.nombre} className="img-fluid" />
                      <h4>{juego.nombre}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
      
      <footer className={styles.footer}>
        <p>© 2025 ALDD Awards. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Categorias;