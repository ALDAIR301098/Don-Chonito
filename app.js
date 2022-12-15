// 1- Invocar Express 
const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path')

const PORT = process.env.PORT || 5542;

const storage = multer.diskStorage({
    destination: path.join('public/images/breads'),
    filename: (req, file, cb) =>{
        cb(null,Date.now() + path.extname(file.originalname));
    },
});

// Multer Middlwares - Creates the folder if doesn't exists
app.use(multer({
    storage: storage,
    dest: path.join('public/images/breads')
}).single('image'));

// 2- Seteamos urlencoded para capturar los datos del formulario 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 3- Invocar a dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' })

// 4- Setear el directorio public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));
app.use(express.static('public'));

// 5- Establecer el motor de plantillas
app.set('view engine', 'ejs');

// 6- Invocar a bcryptjs para hacer el hashing de passwords
const bcryptjs = require('bcryptjs');

// 7- Configurar las variables de sesión
const sesion = require('express-session');
app.use(sesion({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// 8- Invocar al modulo de la conexión de la BD
const connection = require('./database/db');

// 9- Establecemos las rutas

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render("login", {});
})

app.get('/login', (req, res) => {
    res.render("login", {});
})

app.post('/auth', async (req, res) => {
    const mail = req.body.mail;
    const password = req.body.password;
    connection.query('SELECT * FROM USERS WHERE mail = ?', [mail], async (error, results) => {
        if(error) {
            throw error;
        }
        else if (results.length != 0) {
            if(password == results[0].password || (await bcryptjs.compare(password,results[0].password))){
                let data = {
                    alert: true,
                    alertTitle: "Inicio de sesión",
                    alertMessage: "¡Inicio de sesión exitoso!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'catalog'
                }
                if(results[0].rol == 'client'){
                    res.render('login',data)
                } else {
                    data.ruta = 'admin';
                    res.render('login',data);
                }
            }
        } else {
            console.log("USUARIO O CONTRASEÑA INCORRECTA");
        }
    })
});

app.get('/register', (req, res) => {
    res.render("register", {});
})

app.get('/catalog', (req, res) => {
    connection.query('SELECT * FROM breads', (error, rows) => {
        if (error) throw error;
        if (!error) {
            console.log(rows);
            res.render("catalog", { rows })
        }
    })
});

app.get('/admin', (req, res) => {
    connection.query('SELECT * FROM breads', (error, breads) => {
        if (error) throw error;
        if (!error) {
            console.log(breads);
            res.render("admin", { breads })
        }
    })
})

app.post('/uploadBread', async(req,res,) => {
   
    const name = req.body.name;
    const price = parseFloat(req.body.price);
    const image = req.file.filename;

    connection.query('INSERT INTO BREADS SET ?', {
        name: name,
        price: price,
        imageUrl: "images/breads/" + image
    }, async (error, results) => {
        if (error) throw error;
        connection.query('SELECT * FROM breads', (error, breads) => {
            if (error) throw error;
            if (!error) {
                res.render('admin', {
                    breads: breads,
                    alert: true,
                    alertTitle: "Registro de pan",
                    alertMessage: "¡Registro exitoso!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'admin'
                });
            }
        })
    })
});

app.listen(PORT, (req, res) => {
    console.log("SERVER RUNING IN PORT 5544")
})

// 10.- Registro de usuarios
app.post('/register', async (req, res) => {
    const name = req.body.name;
    const lastName = req.body.lastName;
    const gender = req.body.gender;
    const mail = req.body.mail;
    const password = req.body.password;
    let passwordHash = await bcryptjs.hash(password, 8);

    connection.query('INSERT INTO USERS SET ?', {
        name: name,
        lastName: lastName,
        gender: gender,
        rol: 'client',
        mail: mail,
        password: passwordHash
    }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.render('register', {
                alert: true,
                alertTitle: "Registro de usuario",
                alertMessage: "¡Registro exitoso!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: 'catalog'
            });
        }
    });
});