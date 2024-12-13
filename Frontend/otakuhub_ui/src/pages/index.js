import '../app/styles/index.css';
import { Tooltip } from 'react-tooltip'

export default function Home() {
  return (
    <div>
      <header className="globalheader">
        <div>Ver animes</div>
        <img src="https://img.icons8.com/m_rounded/512/FFFFFF/crunchyroll.png" className='logo' />
      </header>
      <div className="overcards">
        <button className='add-button' data-tooltip-id="my-tooltip" data-tooltip-content="Agregar Anime">Agregar anime</button>
      </div>
      <div className="webbody">
        <div className="card-container">
          <div className="card">
            <div className="flipper">
              <img src="https://upload.wikimedia.org/wikipedia/en/6/6f/Death_Note_Vol_1.jpg" />
              <div className="description">Example description</div>
            </div>
            <div className="card-actions">
              <button className="update-button" data-tooltip-id="my-tooltip" data-tooltip-content="Actualizar Anime">
                <i className="fas fa-pen"></i>
              </button>
              <button className="delete-button" data-tooltip-id="my-tooltip" data-tooltip-content="Eliminar Anime">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div className="anime-name">Anime Name</div>
        </div>
        <div className="card-container">
          <div className="card">
            <div className="flipper">
              <img src="https://upload.wikimedia.org/wikipedia/en/6/6f/Death_Note_Vol_1.jpg" />
              <div className="description">Example description</div>
            </div>
            <div className="card-actions">
              <button className="update-button" data-tooltip-id="my-tooltip" data-tooltip-content="Actualizar Anime">
                <i className="fas fa-pen"></i>
              </button>
              <button className="delete-button" data-tooltip-id="my-tooltip" data-tooltip-content="Eliminar Anime">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div className="anime-name">Anime Name</div>
        </div>
      </div>
      <Tooltip id="my-tooltip" />
    </div>
  );
}