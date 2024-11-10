import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Vendedor } from "./entity/vendedor";
import { Produto } from "./entity/produto";
import { Cliente } from "./entity/cliente";
import { Compra } from "./entity/compra";
import { Venda } from "./entity/venda";
import { ItensCompra } from "./entity/itensCompra";
import { ItensVenda } from "./entity/itensVenda";
import { Estoque } from "./entity/estoque";
import { Usuario } from "./entity/usuario";

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
  entities: [Vendedor, Produto, Cliente, Compra, Venda, ItensCompra, ItensVenda, Estoque, Usuario],
  migrations: [],
  subscribers: [],
});
