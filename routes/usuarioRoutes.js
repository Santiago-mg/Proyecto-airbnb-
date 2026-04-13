import express from 'express'
import { formularioLogin, formularioRegistro, registrar, formularioOlvidepassword } from '../controllers/usuarioController.js'

const router = express.Router()

router.get('/login', formularioLogin)
router.get('/registro', formularioRegistro)
router.get('/olvide-password', formularioOlvidepassword)
router.post('/registro', registrar)
export default router
