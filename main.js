// Tecnologias utilizadas: html, css, bootstrap, js, banco de dados, express.

const connection = require('./database/database');
const fs = require('fs')
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');
const express = require('express');
const app = express();


/* public */
app.use(express.static('./assets'));

/* body-parser */

app.use(express.urlencoded({extended: true}));
app.use(express.json())

/* express session */

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: "qualquercoisa", // algo aleatório
    cookie: {
      maxAge: 60*1000 // 1dia = 60*60*24*1000
}
}))

/* database */
connection.authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso!')
    }).catch((msgErro) => {
        console.log(msgErro)
    });

const User = require('./models/UserModel.js');
const e = require('express');

/* middleware */

let middleware = (req, res, next) => {

    if(req.session.authenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}


app.post('/create', async (req, res) => {

    var email = req.body['email'];
    var password = req.body['senha'];

    if(!email || !password) return res.redirect('/create');

    let emailCheck = await User.findOne({
        where: {email: email}
    }).then(user => {
        if(user) return true;
    });

    if(emailCheck) return res.redirect('/create');
    
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    User.create({
        email: email,
        password: hash
    }).then(user => {
        if(user) {
            req.session.authenticated = true;
            return res.redirect('/');
        }
        res.redirect('/create');
    }).catch(() => {
        res.redirect('/create');
    })

})

app.post('/login', (req, res) => {
    var email = req.body['email'];
    var senha = req.body['senha'];

    User.findOne({
        where: {email: email}
    }).then(user => {
        if(!user) return res.redirect('/login');
        var correct = bcrypt.compareSync(senha, user.password);
        if(!correct) return res.redirect('/login');
        req.session.authenticated = true;
        return res.redirect('/');
        
    }).catch(err => {
        console.log(err);
        res.redirect('/login');
    })
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/paginas/login.html'));
})

app.get('/create', (req, res) => {
    res.sendFile(path.join(__dirname, '/paginas/create.html'));
})

/* index */

app.get('/', middleware, (req, res) => {
    res.sendFile(path.join(__dirname, '/paginas/site.html'));
})

/* produtos */

app.get('/produto/:id', middleware ,(req, res) => {
    var id = req.params['id'];
    
    if(!id) return res.redirect('/');

    let file = path.join(__dirname, `/paginas/produto${id}.html`);
    let fileExists = fs.existsSync(file);

    if(!fileExists) return res.send('404 - Produto Inexistente');  
    res.sendFile(file);
});


app.listen(3000,() => {
    console.log('Servidor rodando!')
})
