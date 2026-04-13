import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
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
//habilitar lectura datos formulario 
app.use(express.urlencoded({extended:true}))
// Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

// Carpeta pública
app.use(express.static('public'))

// Routing
app.use('/auth', usuarioRoutes)

// Arrancar servidor
const port = 3000
app.listen(port, () => {
  console.log(`El servidor esta funcionando en el puerto ${port}`)
})
