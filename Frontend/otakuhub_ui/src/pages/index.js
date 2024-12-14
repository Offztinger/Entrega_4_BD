import React, { useState, useEffect } from "react";
import "../app/styles/index.css";
import { Tooltip } from "react-tooltip";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  generosDisponibles,
  estadoActual,
  plataformasDisponibles,
  estudiosDisponibles,
} from "@/utils/constants";
import {
  fetchAnimes,
  fetchAnimesByID,
  PostAnime,
  PutAnime,
  deleteAnime,
} from "@/utils/axiosConfig";
import Head from "next/head";

export default function Home() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formulario, setFormulario] = useState({});
  const [animeData, setAnimeData] = useState([]);
  const [animeToEdit, setAnimeToEdit] = useState([]);
  const [selectedAnimeId, setSelectedAnimeId] = useState(null);

  const fetchData = async () => {
    const initialData = await fetchAnimes();
    setAnimeData(initialData);
  };

  const executeFunction = async (data) => {
    if (selectedAnimeId != null) {
      await PutAnime(data);
    } else {
      await PostAnime({
        ...data,
        plataformas: { id: 1, name: "Crunchyroll" },
      });
    }
    await fetchData();
    hideModal(setShowCreateModal);
  };

  const executeDelete = async () => {
    if (selectedAnimeId != null) {
      await deleteAnime(selectedAnimeId);
    }
    await fetchData();
    hideModal(setShowDeleteModal);
  };

  const handleEdit = (id) => {
    setSelectedAnimeId(id);
    setShowCreateModal(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchAnimesByID(selectedAnimeId);
      setAnimeToEdit(result);
    };

    selectedAnimeId && fetchData();
  }, [selectedAnimeId]);

  useEffect(() => {
    if (animeToEdit) {
      setFormulario({
        id: animeToEdit.ID_ANV,
        nombre: animeToEdit.NOMBRE_ANV,
        descripcion: animeToEdit.DESCRIPCION_ANV,
        imagen: animeToEdit.IMAGEN_ANV,
        puntuacion: animeToEdit.PUNTUACION_ANV,
        totalCapitulos: animeToEdit.TOTAL_CAPITULOS_ANV,
        estado: {
          id: animeToEdit.ESTADOS_OBJ_DATA?.ID_EST,
          name: animeToEdit.ESTADOS_OBJ_DATA?.NOMBRE_EST,
        },
        genero: {
          id: animeToEdit.GENEROS_OBJ_DATA?.ID_GEN,
          name: animeToEdit.GENEROS_OBJ_DATA?.NOMBRE_GEN,
        },
        plataformas: { id: 1, name: "Crunchyroll" },
        estudios: {
          id: animeToEdit.ESTUDIOS_OBJ_DATA?.ID_STD,
          name: animeToEdit.ESTUDIOS_OBJ_DATA?.NOMBRE_STD,
        },
      });
    }
  }, [animeToEdit]);

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
  };

  const handleEstadoChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    const selectedEstado = estadoActual.find(
      (estado) => estado.id === selectedId
    );
    setFormulario({
      ...formulario,
      estado: selectedEstado || { id: "", name: "" },
    });
  };

  const handleEstudioChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    const selectedEstudio = estudiosDisponibles.find(
      (estudios) => estudios.id === selectedId
    );
    setFormulario({
      ...formulario,
      estudios: selectedEstudio || { id: "", name: "" },
    });
  };

  useEffect(() => {
    if (showCreateModal) {
      selectedAnimeId === null &&
        setFormulario({
          nombre: "",
          abreviatura: "",
          descripcion: "",
          imagen: "",
          puntuacion: 1,
          totalCapitulos: "",
          genero: { id: "", name: "" },
          estado: { id: "", name: "" },
          plataformas: { id: "1", name: "Crunchyroll" },
          estudios: { id: "", name: "" },
        });
    } else {
      setSelectedAnimeId(null);
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
    <>
      <Head>
        <title>OTAKUHUB BDOO</title>
      </Head>
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
              <Modal.Title className="modal-title">
                Eliminar registro
              </Modal.Title>
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
                  executeDelete();
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
                  name="nombre"
                  className="form-control"
                  value={formulario.nombre || ""}
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
                <label>Imagen (URL)</label>
                <input
                  type="text"
                  name="imagen"
                  className="form-control"
                  value={formulario.imagen || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Total de capítulos</label>
                <input
                  type="number"
                  name="totalCapitulos"
                  className="form-control"
                  value={formulario.totalCapitulos || ""}
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
                <label>Estado Actual</label>
                <select
                  name="estado"
                  className="form-control"
                  value={formulario.estado?.id || ""}
                  onChange={handleEstadoChange}
                >
                  <option value="">Seleccione un estado</option>
                  {estadoActual.map((estado) => (
                    <option key={estado.id} value={estado.id}>
                      {estado.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Estudios</label>
                <select
                  name="estudios"
                  className="form-control"
                  value={formulario.estudios?.id || ""}
                  onChange={handleEstudioChange}
                >
                  <option value="">Seleccione un estudio</option>
                  {estudiosDisponibles.map((estudios) => (
                    <option key={estudios.id} value={estudios.id}>
                      {estudios.name}
                    </option>
                  ))}
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
                  executeFunction(formulario);
                }}
              >
                {selectedAnimeId ? "Editar" : "Añadir"}
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
                      onClick={() => handleEdit(anime.ID_ANV)}
                    >
                      <i className="fas fa-pen"></i>
                    </button>
                    <button
                      className="delete-button"
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Eliminar Anime"
                      onClick={() => {
                        setSelectedAnimeId(anime.ID_ANV);
                        setShowDeleteModal(true);
                      }}
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
    </>
  );
}
