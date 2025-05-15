import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Categorias.module.css';
import logo from './logo.jpg';

const categorias = [
  {
    titulo: 'Juego Del Año',
    juegos: [
      { nombre: 'The Last of Us Part II', imagen: 'https://m.media-amazon.com/images/M/MV5BODUwNWY5YjctNDZkNy00ZTY1LWEzMzItZGVkYTllOWVjOTc3XkEyXkFqcGdeQXVyNjU4NTIxNzI@._V1_FMjpg_UX1000_.jpg' },
      { nombre: 'Elden Ring', imagen: 'https://th.bing.com/th/id/OIP.0WWz-RuK8mykK2sYIOkpQwAAAA?rs=1&pid=ImgDetMain' },
      // ...hasta 10 juegos
    ],
  },
  {
    titulo: 'Mejor Dirección De Juego',
    juegos: [
      { nombre: 'God of War Ragnarok', imagen: 'https://th.bing.com/th/id/OIP.ECqq9rvark6eBbj7qVUz3wHaJe?rs=1&pid=ImgDetMain' },
      { nombre: 'Death Stranding', imagen: 'https://www.mobygames.com/images/covers/l/602287-death-stranding-playstation-4-front-cover.jpg' },
      // ...hasta 10 juegos
    ],
  },
  {
    titulo: 'Mejor Narrativa de Juego',
    juegos: [
      { nombre: 'Red Dead Redemption 2', imagen: 'https://gamesanookth.com/wp-content/uploads/2019/12/red-dead-redemption-2-standard-edition-cover.jpg' },
      { nombre: 'Life is Strange', imagen: 'https://th.bing.com/th/id/OIP.aa3pPB3zIeY_Y3cjyzhv-wHaKd?rs=1&pid=ImgDetMain' },
      // ...hasta 10 juegos
    ],
  },
];

function Categorias() {
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
                <Link className="nav-link" to="/Perfil">Perfil</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className={`container ${styles['container-vote']}`}>
        <h2 className={styles['shiny-title']}>Top Votos</h2>

        {categorias.map((categoria, idx) => (
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
              <div className="row mb-4 d-flex justify-content-center">
                <button
                        className="btn btn-warning mt-4"
                onClick={() => navigate('/Votaciones')}
                 >
                 Votar por el tuyo
                    </button>
</div>

            </div>
          </section>
        ))}
      </div>
      
      <footer className={styles.footer}>
        <p>&copy; 2025 ALDD Awards. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Categorias;
