import React, { useState, useEffect } from 'react';
import '../app/styles/index.css';
import { Tooltip } from 'react-tooltip';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function Home() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formulario, setFormulario] = useState({});

  const generosDisponibles = [
    { id: 1, name: "Fantasía" },
    { id: 2, name: "Drama" },
    { id: 3, name: "Infantiles" },
    { id: 4, name: "Romance" },
    { id: 5, name: "Acción" },
    { id: 6, name: "Ciencia ficción" },
    { id: 7, name: "Deportes" },
    { id: 8, name: "Mecha" },
    { id: 9, name: "Magia" },
    { id: 10, name: "Superhéroes" },
    { id: 11, name: "Terror" },
    { id: 12, name: "Misterio" },
    { id: 13, name: "Psicológico" },
    { id: 14, name: "Thriller" },
    { id: 15, name: "Comedia" },
  ];

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "puntuacion" && (value <= 0 || value > 10)) {
      const newValue = 1;
      setFormulario({
        ...formulario,
        [name]: newValue,
      });
    } else {
      setFormulario({
        ...formulario,
        [name]: value,
      });
    }
  };

  const handleGeneroChange = e => {
    const selectedId = parseInt(e.target.value, 10);
    const selectedGenero = generosDisponibles.find(genero => genero.id === selectedId);
    setFormulario({
      ...formulario,
      genero: selectedGenero || { id: '', name: '' },
    });
    console.log(selectedGenero)
  };

  useEffect(() => {
    if (showCreateModal) {
      setFormulario({
        nombreAnime: '',
        abreviatura: '',
        descripcion: '',
        totalcaps: '',
        genero: { id: '', name: '' },
        actualstatus: '',
        estudios: '',
        puntuacion: 1,
      });
    }
  }, [showCreateModal]);

  const showModal = setter => {
    setter(true);
    requestAnimationFrame(() => {
      document.querySelector('.modal-overlay').classList.add('active');
    });
  };

  const hideModal = setter => {
    const modalContent = document.querySelector('.modal-overlay');
    modalContent.classList.remove('active');
    modalContent.classList.add('inactive');
    setTimeout(() => {
      setter(false);
      modalContent.classList.remove('inactive');
    }, 150);
  };

  return (
    <div>
      <Modal
        className="modal-overlay"
        show={showDeleteModal}
        onHide={() => hideModal(setShowDeleteModal)}
        dialogClassName=''
        onEntered={() => showModal(setShowDeleteModal)}
        onExit={() => hideModal(setShowDeleteModal)}
      >
        <div className="floating-modal">
          <Modal.Header closeButton className="modal-header">
            <Modal.Title className="modal-title">
              Eliminar registro
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">¿Está seguro que desea eliminar este registro?</Modal.Body>
          <Modal.Footer className="modal-footer">
            <Button
              variant='secondary'
              className='btn btn-dark'
              onClick={() => hideModal(setShowDeleteModal)}
            >
              ¡No!
            </Button>
            <Button
              variant='primary'
              className='btn btn-warning'
              onClick={() => {
                hideModal(setShowDeleteModal);
              }}
            >
              Sí, deseo eliminarlo
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
      <Modal
        className="modal-overlay"
        show={showCreateModal}
        dialogClassName=''
        onHide={() => hideModal(setShowCreateModal)}
        onEntered={() => showModal(setShowCreateModal)}
        onExit={() => hideModal(setShowCreateModal)}
      >
        <div className="floating-modal">
          <Modal.Header closeButton>
            <Modal.Title>
              Añadir Anime
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='form-group'>
              <label>Nombre del Anime</label>
              <input
                type='text'
                name='nombreAnime'
                className='form-control'
                value={formulario.nombreAnime || ''}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Abreviatura (Ruta o imagen)</label>
              <input
                type='text'
                name='abreviatura'
                className='form-control'
                value={formulario.abreviatura || ''}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Descripción</label>
              <input
                type='text'
                name='descripcion'
                className='form-control'
                value={formulario.descripcion || ''}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Total de capítulos</label>
              <input
                type='number'
                name='totalcaps'
                className='form-control'
                value={formulario.totalcaps || ''}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Género</label>
              <select
                name='genero'
                className='form-control'
                value={formulario.genero.id || ''}
                onChange={handleGeneroChange}
              >
                <option value="">Seleccione un género</option>
                {generosDisponibles.map(genero => (
                  <option key={genero.id} value={genero.id}>{genero.name}</option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label>Estado actual</label>
              <select
                name='actualstatus'
                className='form-control'
                value={formulario.actualstatus || ''}
                onChange={handleChange}
              >
                <option value="">Seleccione una opción</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            <div className='form-group'>
              <label>Estudios</label>
              <select
                name='estudios'
                className='form-control'
                value={formulario.estudios || ''}
                onChange={handleChange}
              >
                <option value="">Seleccione un estudio</option>
                <option value="Studio Ghibli">Studio Ghibli</option>
                <option value="Toei Animation">Toei Animation</option>
                <option value="Madhouse">Madhouse</option>
                <option value="MAPPA">MAPPA</option>
                <option value="Ufotable">Ufotable</option>
                <option value="Kyoto Animation">Kyoto Animation</option>
                <option value="Pierrot">Pierrot</option>
              </select>
            </div>
            <div className='form-group'>
              <label>Puntuación</label>
              <input
                type='number'
                name='puntuacion'
                className='form-control'
                value={formulario.puntuacion || ''}
                onChange={handleChange}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              className='btn btn-dark'
              onClick={() => hideModal(setShowCreateModal)}
            >
              Cancelar
            </Button>
            <Button
              variant='primary'
              className='successbutton'
              onClick={() => {
                hideModal(setShowCreateModal);
              }}
            >
              Añadir Anime
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      <header className="globalheader">
        <div>Ver animes</div>
        <img src="https://img.icons8.com/m_rounded/512/FFFFFF/crunchyroll.png" className='logo' />
      </header>
      <div className="overcards">
        <button className='add-button' data-tooltip-id="my-tooltip" data-tooltip-content="Agregar Anime" onClick={() => {
          setShowCreateModal(true);
        }}>Agregar anime</button>
      </div>
      <div className="webbody">
        <div className="card-container">
          <div className="card">
            <div className="flipper">
              <img src="https://upload.wikimedia.org/wikipedia/en/6/6f/Death_Note_Vol_1.jpg" alt="Anime Cover" />
              <div className="description">Example description</div>
            </div>
            <div className="card-actions">
              <button className="update-button" data-tooltip-id="my-tooltip" data-tooltip-content="Actualizar Anime" onClick={() => {
                setShowCreateModal(true);
              }}>
                <i className="fas fa-pen"></i>
              </button>
              <button className="delete-button" data-tooltip-id="my-tooltip" data-tooltip-content="Eliminar Anime" onClick={() => {
                setShowDeleteModal(true);
              }}>
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
