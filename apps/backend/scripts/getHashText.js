import bcrypt from 'bcrypt'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('Ingrese su contraseña: ', async (password) => {
  // Haces algo con la contraseña, como verificarla o procesarla
  const result = await bcrypt.hash(password, 10)

  console.log(result)
  rl.close()
})
