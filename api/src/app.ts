import express, { Application } from "express";
import cors from "cors";
import { authMiddleware } from "./middlewares/authMiddleware";
import utils from "./routes/utilsRoute";
import vendedorRoute from "./routes/vendedorRoute";
import produtoRoute from "./routes/produtoRoute";
import clienteRoute from "./routes/clienteRoute";
import compraRoute from "./routes/compraRoute";
import vendaRoute from "./routes/vendaRoute";
import dashboardRoute from "./routes/dashboardRoute";
import usuarioRoute from "./routes/usuarioRoute";
import taxaRoute from "./routes/taxaRoute";
import estoqueRoute from "./routes/estoqueRoute";
import itemVendaRoute from "./routes/itemVendaRoute";
import itemCompraRoute from "./routes/itemCompraRoute";
import authRoute from "./routes/authRoute"

const app: Application = express();
app.use(express.json());
app.use(cors());

app.use("/api/teds/", utils);

app.use("/api/teds/", authRoute);

app.use("/api/teds/", authMiddleware);

app.use("/api/teds/", vendedorRoute);
app.use("/api/teds/", dashboardRoute);
app.use("/api/teds/", usuarioRoute);
app.use("/api/teds/", produtoRoute);
app.use("/api/teds/", clienteRoute);
app.use('/api/teds/', compraRoute);
app.use('/api/teds/', vendaRoute);
app.use('/api/teds/', taxaRoute);
app.use('/api/teds/', estoqueRoute);
app.use('/api/teds/', itemVendaRoute);
app.use('/api/teds/', itemCompraRoute);

export default app;
