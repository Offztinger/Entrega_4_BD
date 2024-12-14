import React, { useState, useEffect } from "react";
import "../app/styles/index.css";
import { Tooltip } from "react-tooltip";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { getAnimes } from "@/utils/handler";
import { generosDisponibles } from "@/utils/constants";
import { fetchAnimes } from "@/utils/axiosConfig";

export default function Home() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formulario, setFormulario] = useState({});
  const [animeData, setAnimeData] = useState([]);

  const [selectedAnimeId, setSelectedAnimeId] = useState(null);

  const handleEdit = (id) => {
    setSelectedAnimeId(id);
    setShowCreateModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const initialData = await fetchAnimes();
      console.log("initialData", initialData);
      setAnimeData(initialData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (showCreateModal && selectedAnimeId) {
      const animeToEdit = animeData.find(
        (anime) => anime.ID_ANV === selectedAnimeId
      );
      if (animeToEdit) {
        setFormulario({
          nombreAnime: animeToEdit.NOMBRE_ANV,
          descripcion: animeToEdit.DESCRIPCION_ANV,
          totalcaps: animeToEdit.TOTAL_CAPITULOS_ANV,
          genero: animeToEdit.GENEROS_OBJ_DATA,
          actualstatus: animeToEdit.ESTADOS_OBJ_DATA.NOMBRE_EST,
          estudios: animeToEdit.ESTUDIOS_OBJ_DATA.NOMBRE_STD,
          puntuacion: animeToEdit.PUNTUACION_ANV,
        });
      }
    }
  }, [showCreateModal, selectedAnimeId]);

  const handleChange = (e) => {
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

  const handleGeneroChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    const selectedGenero = generosDisponibles.find(
      (genero) => genero.id === selectedId
    );
    setFormulario({
      ...formulario,
      genero: selectedGenero || { id: "", name: "" },
    });
    console.log(selectedAnimeId);
  };

  useEffect(() => {
    if (showCreateModal) {
      setFormulario({
        nombreAnime: "",
        abreviatura: "",
        descripcion: "",
        totalcaps: "",
        genero: { id: "", name: "" },
        actualstatus: "",
        estudios: "",
        puntuacion: 1,
      });
    }
  }, [showCreateModal]);

  const showModal = (setter) => {
    setter(true);
    requestAnimationFrame(() => {
      document.querySelector(".modal-overlay").classList.add("active");
    });
  };

  const hideModal = (setter) => {
    const modalContent = document.querySelector(".modal-overlay");
    modalContent.classList.remove("active");
    modalContent.classList.add("inactive");
    setTimeout(() => {
      setter(false);
      modalContent.classList.remove("inactive");
    }, 150);
  };

  return (
    <div>
      <Modal
        className="modal-overlay"
        show={showDeleteModal}
        onHide={() => hideModal(setShowDeleteModal)}
        dialogClassName=""
        onEntered={() => showModal(setShowDeleteModal)}
        onExit={() => hideModal(setShowDeleteModal)}
      >
        <div className="floating-modal">
          <Modal.Header closeButton className="modal-header">
            <Modal.Title className="modal-title">Eliminar registro</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            ¿Está seguro que desea eliminar este registro?
          </Modal.Body>
          <Modal.Footer className="modal-footer">
            <Button
              variant="secondary"
              className="btn btn-dark"
              onClick={() => hideModal(setShowDeleteModal)}
            >
              ¡No!
            </Button>
            <Button
              variant="primary"
              className="btn btn-warning"
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
        onHide={() => setShowCreateModal(false)}
        dialogClassName=""
      >
        <div className="floating-modal">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedAnimeId ? "Editar Anime" : "Añadir Anime"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Nombre del Anime</label>
              <input
                type="text"
                name="nombreAnime"
                className="form-control"
                value={formulario.nombreAnime || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <input
                type="text"
                name="descripcion"
                className="form-control"
                value={formulario.descripcion || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Total de capítulos</label>
              <input
                type="number"
                name="totalcaps"
                className="form-control"
                value={formulario.totalcaps || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Género</label>
              <select
                name="genero"
                className="form-control"
                value={formulario.genero?.id || ""}
                onChange={handleGeneroChange}
              >
                <option value="">Seleccione un género</option>
                {generosDisponibles.map((genero) => (
                  <option key={genero.id} value={genero.id}>
                    {genero.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Estado actual</label>
              <select
                name="actualstatus"
                className="form-control"
                value={formulario.actualstatus || ""}
                onChange={handleChange}
              >
                <option value="">Seleccione una opción</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estudios</label>
              <select
                name="estudios"
                className="form-control"
                value={formulario.estudios || ""}
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
            <div className="form-group">
              <label>Puntuación</label>
              <input
                type="number"
                name="puntuacion"
                className="form-control"
                value={formulario.puntuacion || ""}
                onChange={handleChange}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="btn btn-dark"
              onClick={() => hideModal(setShowCreateModal)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              className="successbutton"
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
        <img
          src="https://img.icons8.com/m_rounded/512/FFFFFF/crunchyroll.png"
          className="logo"
        />
      </header>
      <div className="overcards">
        <button
          className="add-button"
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Agregar Anime"
          onClick={() => {
            setShowCreateModal(true);
          }}
        >
          Agregar anime
        </button>
      </div>
      <div className="webbody">
        {animeData.length > 0 &&
          animeData.map((anime) => (
            <div key={anime.ID_ANV} className="card-container">
              <div className="card">
                <div className="flipper">
                  <img
                    src={anime.IMAGEN_ANV}
                    alt={`${anime.NOMBRE_ANV} Cover`}
                  />
                  <div className="description">
                    <h3>{anime.NOMBRE_ANV}</h3>
                    <p>{anime.DESCRIPCION_ANV}</p>
                  </div>
                </div>
                <div className="card-actions">
                  <button
                    className="update-button"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Actualizar Anime"
                    onClick={() => handleEdit(anime.ID_ANV)} // Pasar el ID del anime al hacer clic
                  >
                    <i className="fas fa-pen"></i>
                  </button>
                  <button
                    className="delete-button"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Eliminar Anime"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      <Tooltip id="my-tooltip" />
    </div>
  );
}
