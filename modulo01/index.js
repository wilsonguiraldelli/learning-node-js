// importanto dependencia do express

const express = require('express')

// node index.js executa o arquivo index
//console.log(express)

// chamando a função do express - criando o servidor
const server = express()

// passando plugin para que o servidor ouça em JSON
server.use(express.json());

{/* 
  Criando rota GET para teste
  
  Toda função recebe um req e um res
    req - todos os dados da requisição
      Query paramns = ?teste=1
      Route params = /users/1
      Request body = { }

    res - informações para retorno de resposta

    em uma rota que recebe route params, o ':' simboliza a eferição de um parametro a string seguinte
    no exemplo abaixo index
*/}

const users = ['Wilson', 'Milena', 'José']

server.get('/users/:index', (req, res) => {

  // return res.send('Hello World') - envia um texto

  // pegando query params
  //const nome = req.query.nome

  // pegando route paramns
  const { index } = req.params

  return res.json({
    message: `Hello ${users[index]}`
  })
})

//rota que lista todos os usuarios
server.get('/users', (req, res) => {
  res.json(users)
})

// rota de criacao de usuarios
server.post('/users', (req, res) => {
  const { name } = req.body

  users.push(name)
  return res.json(users)
})

// rota que edita o usuario
server.put('/users/:index', (req, res) => {
  const { index } = req.params;
  const { name } = req.body

  users[index] = name

  return res.json(users)
})

//rota para deletar usuário 
server.delete('/users/:index', (req, res) => {
  const { index } = req.params

  users.splice(index, 1)

  return res.json(users)
})

// criando porta no qual o servidor ira ouvir
server.listen(3000)