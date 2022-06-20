const connection = require('../database/database')
//Database

connection.authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso!')
    }).catch((msgErro) => {
        console.log(msgErro)
    })

//Banco de dados falso

var DB = {
    users: [
        {
            id: 1,
            nome: 'Eduardo',
            email: 'eduardo@hotmail.com',
            senha: '123456'
        },
        {
            id: 2,
            nome: 'Gislene',
            email: 'gislene@hotmail.com',
            senha: '654321'
        }
    ]
}

//ROTAS

/*app.post('/auth', (req, res) => {

    var {email, senha} = req.body;

    if(email != undefined){

       var user = DB.users.find(users => users.email == email)

       if(user != undefined){
            if(user.senha == senha){
                res.status(200);
                res.json({token: 'TOKEN FALSO!'})
            }else{
                res.status(401);
                res.json({err: 'A senha enviada é inválida!'})
            }
       }else{
            res.status(404);
            res.json({err: 'O E-mail enviado não existe na base de dados!'})  
       }

    }else{
        res.status(400);
        res.json({err: 'O E-mail enviado é inválido!'})
    }
})*/