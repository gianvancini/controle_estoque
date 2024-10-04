import express from 'express'   
import { healthcheck } from '../controllers/utilsController'

const router = express.Router()

router.get('/healthcheck', healthcheck)

export default router