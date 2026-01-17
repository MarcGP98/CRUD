const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let usuarios = [
  { id: 1, nombre: "Ryu", edad: 32, lugarProcedencia: "Japón" },
  { id: 2, nombre: "Chun-Li", edad: 29, lugarProcedencia: "China" },
  { id: 3, nombre: "Guile", edad: 35, lugarProcedencia: "Estados Unidos" },
  { id: 4, nombre: "Dhalsim", edad: 45, lugarProcedencia: "India" },
  { id: 5, nombre: "Blanka", edad: 32, lugarProcedencia: "Brasil" },
];

app.get("/usuarios", (req, res) => {
  res.json(usuarios);
});

app.get("/usuarios/:nombre", (req, res) => {
  const nombre = req.params.nombre;

  const usuario = usuarios.find((u) => u.nombre === nombre);

  if (!usuario) {
    return res.status(404).json({ mensaje: "Usuario no encontrado" });
  }

  res.json(usuario);
});

app.post("/usuarios", (req, res) => {
  const { nombre, edad, lugarProcedencia } = req.body;

  if (!nombre || !edad || !lugarProcedencia) {
    return res.status(400).json({
      mensaje: "Faltan datos: nombre, edad, lugarProcedencia",
    });
  }

  const existe = usuarios.find((u) => u.nombre === nombre);
  if (existe) {
    return res.status(400).json({ mensaje: "Ese nombre ya existe" });
  }

  const newId = usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1;

  const nuevoUsuario = {
    id: newId,
    nombre: nombre,
    edad: Number(edad),
    lugarProcedencia: lugarProcedencia,
  };

  usuarios.push(nuevoUsuario);

  res.status(201).json(nuevoUsuario);
});

app.put("/usuarios/:nombre", (req, res) => {
  const nombre = req.params.nombre;

  const index = usuarios.findIndex((u) => u.nombre === nombre);

  if (index === -1) {
    return res.status(404).json({ mensaje: "Usuario no encontrado" });
  }

  const { edad, lugarProcedencia } = req.body;

  if (edad !== undefined) {
    usuarios[index].edad = Number(edad);
  }

  if (lugarProcedencia !== undefined) {
    usuarios[index].lugarProcedencia = lugarProcedencia;
  }

  res.json({ mensaje: "Usuario actualizado", usuario: usuarios[index] });
});

app.delete("/usuarios/:nombre", (req, res) => {
  const nombre = req.params.nombre;

  const existe = usuarios.find((u) => u.nombre === nombre);
  if (!existe) {
    return res.status(404).json({ mensaje: "Usuario no encontrado" });
  }

  usuarios = usuarios.filter((u) => u.nombre !== nombre);

  res.json({ mensaje: "Usuario eliminado" });
});

app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});