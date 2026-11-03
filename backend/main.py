from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware # <-- 1. Importamos el permiso

app = FastAPI()

# 2. Configuramos los permisos de CORS para que React pueda hablarle sin problemas
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite que cualquier cliente (como tu React) se conecte
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, PUT, DELETE)
    allow_headers=["*"],
)

class TareaCreate(BaseModel):
    titulo: str
    completada: Optional[bool] = False

tareas = [
    {"id": 1, "titulo": "estudiar chino", "completada": False},
    {"id": 2, "titulo": "formatear la pc", "completada": True},
    {"id": 3, "titulo": "hacer el té", "completada": False}
]

@app.get("/")
def read_root():
    return {"mensaje": "¡Bienvenido a TaskFlow API!"}

@app.get("/tasks")
def obtener_tareas():
    return tareas

@app.post("/tasks")
def crear_tarea(tarea: TareaCreate):
    nueva_tarea = {
        "id": len(tareas) + 1,
        "titulo": tarea.titulo,
        "completada": tarea.completada
    }
    tareas.append(nueva_tarea)
    return {"mensaje": "¡Tarea creada con éxito!", "tarea": nueva_tarea}

@app.put("/tasks/{id}/toggle")
def cambiar_estado(id: int):
    for tarea in tareas:
        if tarea["id"] == id:
            tarea["completada"] = not tarea["completada"]
            return {"mensaje": "Estado de la tarea actualizado", "tarea": tarea}
    return {"error": "No se encontró ninguna tarea con ese ID"}

@app.delete("/tasks/{id}")
def eliminar_tarea(id: int):
    for index, tarea in enumerate(tareas):
        if tarea["id"] == id:
            tarea_borrada = tareas.pop(index)
            return {"mensaje": "Tarea eliminada con éxito", "tarea": tarea_borrada}
    return {"error": "No se encontró ninguna tarea con ese ID para eliminar"}