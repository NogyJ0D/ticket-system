const jwt = require('jsonwebtoken')
const config = require('../config')

const isHelper = (req, res, next) => {
  req.neededRole = 1
  verifyToken(req, res, next)
}

const isOwner = (req, res, next) => {
  req.neededRole = 2
  verifyToken(req, res, next)
}

const verifyToken = (req, res, next) => {
  const auth = req.header('Authorization')
  const tokenCookie = req.cookies?.token

  if (!auth && !tokenCookie) {
    return res.status(403).json({
      success: false,
      status: 'No-Auth',
      message: 'Se requiere un token para este proceso.'
    })
  }

  if (tokenCookie) handleToken(tokenCookie, req, res, next)
  else {
    const token = auth.split(' ')[1]
    handleToken(token, req, res, next)
  }
}

const handleToken = (token, req, res, next) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    req.user = decoded
    validateRole(req, res, next)
  } catch (err) {
    return res.status(403).json({
      success: true,
      status: 'Expired',
      message: 'Se requiere un token válido para este proceso.'
    })
  }
}

const validateRole = (req, res, next) => {
  if (req.user.role >= req.neededRole) return next()
  else {
    return res.status(403).json({
      success: true,
      status: 'Permisos insuficientes',
      message: 'Se requiere un token superior para este proceso.'
    })
  }
}

module.exports = { isHelper, isOwner }
