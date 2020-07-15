// code away!
const server = require('./server.js')
const PORT = 1337;

server.listen(PORT, () => {
  console.log(`\n *** server started on port. *** ${PORT}`)
})