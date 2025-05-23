import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Perfil.module.css';
import logo from './logo.jpg';

function Perfil() {
  const navigate = useNavigate();

  const [gameId, setGameId] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [availableGames, setAvailableGames] = useState([]);
  const [user, setUser] = useState(null);
  const [games, setGames] = useState({
    inProgress: [],
    completed: [],
    liked: [],
    disliked: [],
  });
  const [activeList, setActiveList] = useState(null);
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
          setGames({
            inProgress: result.data.gamesInProgress.map(game => typeof game === 'string' ? game : game._id) || [],
            completed: result.data.gamesCompleted.map(game => typeof game === 'string' ? game : game._id) || [],
            liked: result.data.gamesLiked.map(game => typeof game === 'string' ? game : game._id) || [],
            disliked: result.data.gamesDisliked.map(game => typeof game === 'string' ? game : game._id) || [],
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

    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:8080/games', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (response.ok && result.data) {
          console.log('Available games:', JSON.stringify(result.data, null, 2));
          setAvailableGames(result.data.filter(game => game._id && game.title));
        }
      } catch (error) {
        console.error('Error al cargar juegos:', error);
      }
    };

    fetchUserData();
    fetchGames();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/users/user/${user.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (response.ok && result.data) {
        return result.data;
      }
      throw new Error('Failed to fetch user data');
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage('Debes iniciar sesión para agregar juegos');
      return;
    }

    const categoryMap = {
      inProgress: 'add-in-progress',
      completed: 'add-completed',
      liked: 'add-liked',
      disliked: 'add-disliked',
    };

    const endpoint = categoryMap[category];

    if (!endpoint || !gameId) {
      setMessage('Debes seleccionar una categoría y un juego.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/users/user/${user.id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Juego agregado correctamente');
        if (data.data) {
          setGames({
            inProgress: data.data.gamesInProgress.map(game => typeof game === 'string' ? game : game._id) || [],
            completed: data.data.gamesCompleted.map(game => typeof game === 'string' ? game : game._id) || [],
            liked: data.data.gamesLiked.map(game => typeof game === 'string' ? game : game._id) || [],
            disliked: data.data.gamesDisliked.map(game => typeof game === 'string' ? game : game._id) || [],
          });
        } else {
          try {
            const userData = await fetchUserData();
            setGames({
              inProgress: userData.gamesInProgress.map(game => typeof game === 'string' ? game : game._id) || [],
              completed: userData.gamesCompleted.map(game => typeof game === 'string' ? game : game._id) || [],
              liked: userData.gamesLiked.map(game => typeof game === 'string' ? game : game._id) || [],
              disliked: userData.gamesDisliked.map(game => typeof game === 'string' ? game : game._id) || [],
            });
          } catch (error) {
            setMessage('Error al actualizar los datos del usuario');
          }
        }
        setGameId('');
        setCategory('');
      } else {
        setMessage(`Error: ${data.message || 'No se pudo agregar'}`);
      }
    } catch (error) {
      console.error('Error al conectar:', error);
      setMessage('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGame = async (gameId, category) => {
    if (!user) {
      setMessage('Debes iniciar sesión para eliminar juegos');
      return;
    }

    const categoryMap = {
      inProgress: 'remove-in-progress',
      completed: 'remove-completed',
      liked: 'remove-liked',
      disliked: 'remove-disliked',
    };

    const endpoint = categoryMap[category];

    if (!endpoint) {
      setMessage('Categoría no válida');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/users/user/${user.id}/${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Juego eliminado correctamente');
        if (data.data) {
          setGames({
            inProgress: data.data.gamesInProgress.map(game => typeof game === 'string' ? game : game._id) || [],
            completed: data.data.gamesCompleted.map(game => typeof game === 'string' ? game : game._id) || [],
            liked: data.data.gamesLiked.map(game => typeof game === 'string' ? game : game._id) || [],
            disliked: data.data.gamesDisliked.map(game => typeof game === 'string' ? game : game._id) || [],
          });
        } else {
          try {
            const userData = await fetchUserData();
            setGames({
              inProgress: userData.gamesInProgress.map(game => typeof game === 'string' ? game : game._id) || [],
              completed: userData.gamesCompleted.map(game => typeof game === 'string' ? game : game._id) || [],
              liked: userData.gamesLiked.map(game => typeof game === 'string' ? game : game._id) || [],
              disliked: userData.gamesDisliked.map(game => typeof game === 'string' ? game : game._id) || [],
            });
          } catch (error) {
            setMessage('Error al actualizar los datos del usuario');
          }
        }
      } else {
        setMessage(`Error: ${data.message || 'No se pudo eliminar'}`);
      }
    } catch (error) {
      console.error('Error al eliminar juego:', error);
      setMessage('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const showList = (listName) => {
    setActiveList(listName);
  };

  const getGameDetails = (gameId) => {
    const game = availableGames.find(game => game._id === gameId);
    return game || { _id: gameId, title: 'Juego no encontrado', genre: 'N/A', releaseDate: null };
  };

  return (
    <div className={styles.body}>
      <title>Perfil - ALDD Awards</title>
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
                <Link className="nav-link" to="/Categorias">
                  Categorias
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/EditarPerfil">
                  Editar
                </Link>
              </li>
              {user && (
                  <button 
                    className="btn btn-danger ms-3"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </button>
              )}
            </ul>
            <button
              className="btn btn-warning ms-3"
              data-bs-toggle="modal"
              data-bs-target="#authModal"
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : 'Agregar Juegos'}
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
        <img
          src="https://th.bing.com/th/id/OIP._qSKWYY_8MMeUZCoX-U7uAHaHa?rs=1&pid=ImgDetMain"
          alt="Imagen de usuario"
          className={styles['profile-img']}
        />
        <h2 className="mt-3">{user ? user.name : 'Cargando...'}</h2>

        <div className={styles.options}>
          <button
            className="btn btn-warning"
            onClick={() => showList('inProgress')}
            disabled={isLoading}
          >
            Juegos en progreso
          </button>
          <button
            className="btn btn-warning"
            onClick={() => showList('completed')}
            disabled={isLoading}
          >
            Juegos terminados
          </button>
          <button
            className="btn btn-warning"
            onClick={() => showList('liked')}
            disabled={isLoading}
          >
            Juegos que me gustan
          </button>
          <button
            className="btn btn-warning"
            onClick={() => showList('disliked')}
            disabled={isLoading}
          >
            Juegos que no me gustan
          </button>
        </div>

        {activeList && (
          <div className="mt-4">
            <h3>
              {{
                inProgress: 'Juegos en Progreso',
                completed: 'Juegos Terminados',
                liked: 'Juegos que me Gustan',
                disliked: 'Juegos que no me Gustan',
              }[activeList] || 'Categoría no encontrada'}
            </h3>
            {games[activeList].length > 0 ? (
              <ul className="list-group">
                {games[activeList].map((gameId) => {
                  const game = getGameDetails(gameId);
                  return (
                    <li key={gameId} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        <strong>{game.title}</strong> (
                        {game.genre},{' '}
                        {game.releaseDate
                          ? new Date(game.releaseDate).getFullYear()
                          : 'Sin fecha'}
                        )
                      </span>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteGame(gameId, activeList)}
                        disabled={isLoading}
                      >
                        Eliminar
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No hay juegos en esta categoría.</p>
            )}
          </div>
        )}

        {message && (
          <div className="alert alert-info mt-3" role="alert">
            {message}
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <p>© 2025 ALDD Awards. Todos los derechos reservados.</p>
      </footer>

      <div
        className="modal fade"
        id="authModal"
        tabIndex="-1"
        aria-labelledby="authModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content text-dark">
            <div className="modal-header">
              <h5 className="modal-title" id="authModalLabel">
                Agregar Juego a una de tus Categorías
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <label htmlFor="gameSelect" className="form-label">
                  Seleccionar Juego
                </label>
                <select
                  className="form-select mb-3"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  required
                  disabled={isLoading}
                >
                  <option value="">-- Selecciona un juego --</option>
                  {availableGames.map((game) => (
                    <option key={game._id} value={game._id}>
                      {game.title}
                    </option>
                  ))}
                </select>
                <label htmlFor="categorySelect" className="form-label">
                  Seleccionar Categoría
                </label>
                <select
                  className="form-select mb-3"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  disabled={isLoading}
                >
                  <option value="">-- Selecciona una opción --</option>
                  <option value="inProgress">Juegos en Progreso</option>
                  <option value="completed">Juegos Terminados</option>
                  <option value="liked">Juegos que me Gustan</option>
                  <option value="disliked">Juegos que no me Gustan</option>
                </select>
                <button
                  className="btn btn-warning w-100"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Procesando...' : 'Confirmar'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;