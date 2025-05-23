import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ALDD.module.css';
import logo from './logo.jpg';

function ALDD() {
  const navigate = useNavigate();

  // Estados para formulario
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estado para alternar entre login y registro
  const [isLogin, setIsLogin] = useState(true);

  // Estado para mensajes de error o éxito
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Estado para el usuario autenticado
  const [user, setUser] = useState(() => {
    // Cargar usuario desde localStorage al iniciar
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevenir múltiples envíos

    setMessage('');
    setLoading(true);

    const endpoint = isLogin ? 'http://localhost:8080/users/login' : 'http://localhost:8080/users/register';
    const data = isLogin ? { mail: email, password } : { id, name, mail: email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMessage(result.message || 'Error desconocido');
        return;
      }

      // Guardar datos del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(result.user));
      setUser(result.user); // Actualizar estado del usuario

      setMessage(isLogin ? `Bienvenido, ${result.user.name}` : 'Registro exitoso, ya puedes iniciar sesión.');
      navigate('/Perfil');
    } catch (error) {
      console.error(error);
      setMessage('Error al conectar con el servidor');
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setMessage('Sesión cerrada');
    navigate('/');
  };

  // Verificar si hay un usuario al cargar el componente
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && !user) {
      setUser(JSON.parse(savedUser));
    }
  }, [user]);

  return (
    <div className={styles.body}>
      <title>ALDD Awards</title>
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
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
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
                <Link className="nav-link" to="/Votaciones">
                  Votaciones
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
            </ul>
            {user ? (
              <div className="d-flex align-items-center ms-3">
                <span className="text-white me-3">Hola, {user.name}</span>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <button
                className="btn btn-warning ms-3"
                data-bs-toggle="modal"
                data-bs-target="#authModal"
                onClick={() => {
                  setMessage('');
                  setName('');
                  setEmail('');
                  setPassword('');
                  setIsLogin(true);
                }}
              >
                Iniciar sesión / Registrarse
              </button>
            )}
          </div>
        </div>
      </nav>

      <header className={styles.hero}>
        <h1 className="display-4">Vota por tu videojuego favorito</h1>
        <p className="lead">Únete a la comunidad y elige a los ganadores de cada categoría</p>
        <a href="#votar" className="btn btn-warning btn-lg">
          ¡Descubre Ahora!
        </a>
      </header>

      <section className={`container ${styles.nominees}`} id="votar">
        <h2 className="mb-4">Categorías</h2>
        <div className="row">
          {[
            { title: 'Juego Del Año' },
            { title: 'Juegos Más Gustados' },
            { title: 'Mayor Tasa de Finalización' },
          ].map((item, index) => (
            <div key={index} className="col-md-4">
              <div className={styles['game-card']}>
                <img
                  src="https://png.pngtree.com/thumb_back/fh260/background/20210901/pngtree-luxury-golden-shield-award-ceremony-background-image_774496.jpg"
                  className="img-fluid"
                  alt={item.title}
                />
                <h4 className="mt-2">{item.title}</h4>
                <button
                  className="btn btn-warning mt-2"
                  onClick={() => navigate('/Categorias')}
                >
                  Ver Categorias
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2025 ALDD Awards. Todos los derechos reservados.</p>
      </footer>

      {/* Modal */}
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
                {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
                onClick={() => setMessage('')}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <input
                    className="form-control mb-2"
                    type="number"
                    placeholder="Id"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                  />
                )}
                {!isLogin && (
                  <input
                    className="form-control mb-2"
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                )}
                <input
                  className="form-control mb-2"
                  type="email"
                  placeholder="Correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="form-control mb-2"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button className="btn btn-warning w-100" type="submit" disabled={loading}>
                  {isLogin ? 'Ingresar' : 'Registrar'}
                </button>
              </form>
              <div className="mt-3 text-center">
                <small>
                  {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                  <button
                    className="btn btn-link p-0"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setMessage('');
                      setName('');
                      setEmail('');
                      setPassword('');
                    }}
                  >
                    {isLogin ? 'Regístrate' : 'Inicia sesión'}
                  </button>
                </small>
              </div>
              {message && (
                <div className="alert alert-info mt-3" role="alert">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ALDD;