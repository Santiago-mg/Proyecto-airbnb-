import {check, validationResult} from 'express-validator'
import Usuario from "../models/Usuario.js"
import { generarId } from '../helpers/tokens.js'

const formularioLogin = (req, res) => {
  res.render('auth/login', {})
}

const formularioRegistro = (req, res) => {
  res.render('auth/registro', {})
}
const formularioOlvidepassword = (req, res) => {
  res.render('auth/olvide-password', {
    pagina: 'Recupera tu acceso a Bienes Raices'
  })
}
const registrar = async(req, res) => {
  //validacion 
  await check('nombre', 'El nombre es obligatorio').notEmpty().run(req)
  await check('email', 'no es un email').isEmail().run(req)
  await check('password').isLength({min: 6}).withMessage('minimo 6 caracteres').run(req)
  await check('repetir_password').equals('password').withMessage('los passwords no son iguales').run(req)
  let resultado = validationResult(req)
    // ✅ Si hay errores, NO crea usuario
  if (!resultado.isEmpty()) {
    return res.render('auth/registro',{
      pagina: 'Crear cuenta ',
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    })
  }
  //extraer los datos 
  const {nombre, email,password}= req.body
  //verificar su el usuario existe 
  const existeUsuario = await  Usuario.findOne({where: {email}})
  if (existeUsuario){
    return res.render('auth/registro',{
      pagina: 'Crear cuenta ',
      errores: [{msg:'El usuario ya esta registrado'}],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    })
  } 
  console.log(existeUsuario)
  // ✅ Crear usuario
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId()
  })
  // Mostrar mensaje de éxito
  res.render('templates/mensaje', {
    pagina: 'Cuenta creada correctamente',
    mensaje: 'Hemos enviado un email de confirmación, presiona en el enlace'
  })
}

export {
  formularioLogin,
  formularioRegistro,
  registrar,
  formularioOlvidepassword
}
