import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
import { paginainicio } from './controllers/usuarioController.js'
import db from './config/db.js'

const app = express()

// Conexión a la base de datos
async function conectarDB() {
  try {
    await db.authenticate()
    await db.sync()
    console.log('Conectado a la base de datos ✅')
  } catch (error) {
    console.error('Error de conexión ❌', error)
  }
}

conectarDB()

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }))

// Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

// Carpeta pública
app.use(express.static('public'))

// Ruta principal
app.get('/', (req, res) => {
  res.redirect('/auth/inicio')
})

// Ruta de inicio
app.get('/template/inicio', paginainicio)

// Rutas de autenticación
app.use('/auth', usuarioRoutes)

// Arrancar servidor
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`El servidor está funcionando en el puerto ${port}`)
})