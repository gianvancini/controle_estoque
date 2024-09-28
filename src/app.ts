// app.ts
import express, {Application} from "express"
import {AppDataSource} from "./data-source"
import cors from "cors"
import utils from "./routes/utilsRoute"
import vendedorRoute from "./routes/vendedorRoute"
import produtoRoute from "./routes/produtoRoute"

const app: Application = express()
app.use(express.json())
app.use(cors())

app.use("/api", utils)
app.use("/api", vendedorRoute)
app.use("/api", produtoRoute)

export default app