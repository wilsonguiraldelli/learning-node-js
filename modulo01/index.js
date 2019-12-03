// importanto dependencia do express

const express = require('express')

// node index.js executa o arquivo index
//console.log(express)

// chamando a função do express - criando o servidor
const server = express()

// passando plugin para que o servidor ouça em JSON
server.use(express.json());

//Criando um middlware global
server.use((req, res, next) => {
  console.log(`Método: ${req.method}; URL: ${req.url}`)

  // função next permite que as proximas funções sejam executadas. Uma vez que apenas a execução do middleware bloqueia os procimos comandos
  return next()
})

//criando middleware local

function checkUserExists(req, res, next) {
  if (!req.body.name) {

    // retornando mensagem do tipo bad request, indicando dados faltando
    return res.status(400).json({ error: 'User name is required' })
  }

  return next()
}

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
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body

  users.push(name)
  return res.json(users)
})

// rota que edita o usuario
server.put('/users/:index', checkUserExists, (req, res) => {
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