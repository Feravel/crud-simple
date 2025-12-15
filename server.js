const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("database.db");
db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        completed INTEGER
    )
`);

app.use(express.json());
app.use(express.static("public"));

//-----------------------------------------------------------
//Endpoint 1 - Crear tarea POST
app.post("/tasks", (req, res) => { 
  const { title, description } = req.body;

    db.run(
        "INSERT INTO tasks (title, description, completed) VALUES (?, ?, 0)",
        [title, description],
        function () {
            res.json({ id: this.lastID });
        }
    );
});
//-----------------------------------------------------------
//Endpoint 2 - Leer tareas GET
app.get("/tasks", (req, res) => { 
    db.all("SELECT * FROM tasks", (err, rows) => {
        res.json(rows);
    });
});
//-----------------------------------------------------------
//Endpoint 3 - Actualizar tarea PUT
app.put("/tasks/:id", (req, res) => {
    const { completed } = req.body;

    db.run(
        "UPDATE tasks SET completed = ? WHERE id = ?",
        [completed, req.params.id],
        () => {
            res.sendStatus(200);
        }
    );
});
//-----------------------------------------------------------
//Endpoint 4 - Eliminar tarea DELETE
app.delete("/tasks/:id", (req, res) => {
    db.run("DELETE FROM tasks WHERE id = ?", req.params.id, () => {
        res.sendStatus(200);
    });
});
//-----------------------------------------------------------

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server running on http://localhost:3000");
});

