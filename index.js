const express = require('express');
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');
const mysql2 = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;


const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

const simulateDate = "2024-12-01"
let connection;

async function initializeDatabase() {
    try {
        connection = await mysql2.createConnection({
            host: 'andre-calendar.ct0ywq6ie37s.us-east-1.rds.amazonaws.com',
            user: 'admin',
            password: 'fantasmita312',
            database: 'calendario_civico'
        });
        console.log('Conectado a la base de datos de eventos.');
    } catch (error) {
        console.error('Error conectando a la base de datos de eventos: ' + error.stack);
    }
}

app.get('/evento', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    try {
        const [results] = await connection.query('SELECT evento, ods FROM fechas_importantes WHERE fecha = ?', [simulateDate]);

        if (results.length > 0) {
            const { evento, ods } = results[0];
            res.send(`Hoy es ${today}, se celebra: ${evento}. (${ods})`);
        } else {
            res.send(`Hoy es ${today}, no hay eventos programados.`);
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta: ' + error);
    }
});

async function startServer() {
    await initializeDatabase();
}

startServer();




const conexion = mysql.createConnection({
    host: 'andre-calendar.ct0ywq6ie37s.us-east-1.rds.amazonaws.com',
    database: 'calendario_civico',
    user: 'admin',
    password: 'fantasmita312'
});

conexion.connect((error) => {
    if (error) {
        console.log('Error conectando a la base de datos: ' + error.stack);
    } else {
        console.log('Conectado a la base de datos');
    }
});


app.post('/registro', (req, res) => {
    const { nombres, apellidos, email, password } = req.body;

    console.log('Datos recibidos:', req.body); // Verifica los datos recibidos

    if (!nombres || !apellidos || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const query = 'INSERT INTO register (names, last_names, email, password) VALUES (?, ?, ?, ?)';
    conexion.query(query, [nombres, apellidos, email, password], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al registrar el usuario' });
        } else {
            res.status(200).json({ message: 'Usuario registrado exitosamente' });
        }
    });
});



app.listen(port, () => {
    console.log(`Server on port localhost:${port}`);
})