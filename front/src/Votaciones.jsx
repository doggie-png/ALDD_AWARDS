import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Votaciones.module.css";
import logo from "./logo.jpg";

function Votaciones() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user from localStorage
    const savedUser = localStorage.getItem("user");
    const userData = savedUser ? JSON.parse(savedUser) : null;
    setUser(userData);

    // Fetch top voted games
    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:8080/votaciones/top");
        if (!response.ok) throw new Error("Failed to fetch games");
        const data = await response.json();
        setGames(data);
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch user voting status
    const fetchUserStatus = async (userId) => {
      try {
        const response = await fetch(`http://localhost:8080/votaciones/user-status?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user status");
        const data = await response.json();
        setHasVoted(data.hasVoted);
      } catch (err) {
        setError(err.message);
      }
    };

    // Run fetches
    const initialize = async () => {
      await fetchGames();
      if (userData && Number.isInteger(userData.id)) {
        await fetchUserStatus(userData.id);
      }
      setLoading(false);
    };

    initialize();
  }, []);

  const selectGame = (id) => {
    if (!hasVoted) {
      setSelectedGame(id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setHasVoted(false);
    navigate("/");
  };

  const confirmVote = async () => {
    if (!user || !Number.isInteger(user.id)) {
      alert("Debes iniciar sesión con un usuario válido para votar.");
      return;
    }
    if (hasVoted) {
      alert("Ya has votado. Solo se permite un voto por usuario.");
      return;
    }
    if (!selectedGame) {
      alert("Por favor, selecciona un juego antes de votar.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/votaciones/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: selectedGame, userId: user.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit vote");
      setHasVoted(true);
      setSelectedGame(null);
      alert(data.message);
    } catch (err) {
      alert(`Error al registrar el voto: ${err.message}`);
    }
  };

  if (loading) return <div className={styles.body}>Cargando...</div>;
  if (error) return <div className={styles.body}>Error: {error}</div>;

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
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
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
                <Link className="nav-link" to="/Perfil">
                  Perfil
                </Link>
              </li>
              {user ? (
              <div className="d-flex align-items-center ms-3">
                <span className="text-white me-3">Hola, {user.name}</span>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
            ) : null}
            </ul>
          </div>
        </div>
      </nav>

      <section className={`container ${styles["container-vote"]}`}>
        <h2 className="mb-4">Mejor Juego | Best Game</h2>
        {!user && <p className="text-warning">Inicia sesión para votar.</p>}
        {hasVoted && <p className="text-warning">Ya has votado. Solo se permite un voto por usuario.</p>}
        <div className="row">
          {games.map((game) => (
            <div key={game.id} className="col-md-4 mt-4">
              <div
                className={styles["game-card"]}
                onClick={() => selectGame(game.id)}
                style={{
                  border: selectedGame === game.id ? "2px solid #b8860b" : "none",
                  opacity: hasVoted ? 0.6 : 1,
                  cursor: hasVoted ? "not-allowed" : "pointer",
                }}
              >
                <img src={game.img} className="img-fluid" alt={game.title} />
                <h4 className="mt-2">{game.title}</h4>
                <p>Votos: ?</p>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-warning mt-4" onClick={confirmVote} disabled={hasVoted || !user || !Number.isInteger(user.id)}>
          Realizar voto
        </button>
      </section>

      <footer className={styles.footer}>
        <p>© 2025 ALDD Awards. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Votaciones;