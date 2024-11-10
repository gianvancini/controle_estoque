import express, { Application } from "express";
import cors from "cors";
import { authMiddleware } from "./middlewares/authMiddleware";
import utils from "./routes/utilsRoute";
import vendedorRoute from "./routes/vendedorRoute";
import produtoRoute from "./routes/produtoRoute";
import clienteRoute from "./routes/clienteRoute";
import compraRoute from "./routes/compraRoute";
import vendaRoute from "./routes/vendaRoute";
import estoqueRoute from "./routes/estoqueRoute";
import itemVendaRoute from "./routes/itemVendaRoute";
import itemCompraRoute from "./routes/itemCompraRoute";
import authRoute from "./routes/authRoute"

const app: Application = express();
app.use(express.json());
app.use(cors());

app.use("/api", utils);

app.use("/api", authRoute);

app.use("/api", authMiddleware);

app.use("/api", vendedorRoute);
app.use("/api", produtoRoute);
app.use("/api", clienteRoute);
app.use('/api', compraRoute);
app.use('/api', vendaRoute);
app.use('/api', estoqueRoute);
app.use('/api', itemVendaRoute);
app.use('/api', itemCompraRoute);

export default app;
