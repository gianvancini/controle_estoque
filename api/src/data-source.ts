import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Vendedor } from "./entities/vendedor";
import { Produto } from "./entities/produto";
import { Cliente } from "./entities/cliente";
import { Compra } from "./entities/compra";
import { Venda } from "./entities/venda";
import { ItensCompra } from "./entities/itensCompra";
import { ItensVenda } from "./entities/itensVenda";
import { Estoque } from "./entities/estoque";
import { Usuario } from "./entities/usuario";
import { Taxa } from "./entities/taxa";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Vendedor, Produto, Cliente, Compra, Venda, ItensCompra, ItensVenda, Estoque, Usuario, Taxa],
  migrations: [],
  subscribers: [],
});
