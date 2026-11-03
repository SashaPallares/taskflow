import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // 1. LAS CAJAS DE MEMORIA
  const [tareas, setTareas] = useState([]);
  const [nuevoTitulo, setNuevoTitulo] = useState("");

  // 2. EL DISPARADOR AUTOMÁTICO
  useEffect(() => {
    fetch("http://127.0.0.1:8000/tasks")
      .then((res) => res.json())
      .then((data) => setTareas(data))
      .catch((error) => console.error("Error al conectar con Python:", error));
  }, []);

  // 3. FUNCIÓN NUEVA TAREA
  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!nuevoTitulo.trim()) return;

    fetch("http://127.0.0.1:8000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ titulo: nuevoTitulo, completada: false }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTareas([...tareas, data.tarea]);
        setNuevoTitulo("");
      })
      .catch((error) => console.error("Error al crear tarea:", error));
  };

  // CAMBIO DE ESTADO DE TAREAS
  const cambiarEstadoTarea = (idActual) => {
    fetch(`http://127.0.0.1:8000/tasks/${idActual}/toggle`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => {
        // Actualizamos el estado local
        const tareasActualizadas = tareas.map((tarea) => {
          if (tarea.id === idActual) {
            return data.tarea;
          }
          return tarea;
        });
        setTareas(tareasActualizadas);
      })
      .catch((error) => console.error("Error al cambiar estado:", error));
  };

  // 4. HTML estructurado
  return (
    <div className="contenedor-principal">
      <h1 className="titulo-principal">TaskFlow</h1>
      <p>Lista de tareas</p>

      {/* Formulario */}
      <form onSubmit={manejarEnvio} className="formulario-tarea">
        <input
          type="text"
          placeholder="Tarea"
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
          className="input-tarea"
        />
        <button type="submit" className="boton-agregar">
          Agregar
        </button>
      </form>

      {/* Lista ordenada */}
      <ul className="lista-tareas">
        {tareas
          .slice()
          .sort((a, b) => a.completada - b.completada) // Las no completadas (0 / false) van primero, las completadas (1 / true) al final
          .map((tarea) => (
            <li
              key={tarea.id}
              className={`item-tarea ${tarea.completada ? "completada" : ""}`}
              onClick={() => cambiarEstadoTarea(tarea.id)}
              style={{ cursor: "pointer" }}
            >
              <strong>{tarea.titulo} — </strong>
              <span>{tarea.completada ? "✅ Completada" : "⏳ Pendiente"}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
