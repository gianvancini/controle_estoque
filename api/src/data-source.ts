import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Vendedor } from "./entity/vendedor";
import { Produto } from "./entity/produto";
import { Cliente } from "./entity/cliente";

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
  entities: [Vendedor, Produto, Cliente],
  migrations: [],
  subscribers: [],
});
