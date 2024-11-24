import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Venda } from "./venda";

@Entity()
export class Cliente {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: String;

    @Column()
    cpf: String;

    @Column()
    email: String;

    @Column()
    telefone: String;

    @Column()
    endereco: String;

    @Column()
    numero: Number;

    @Column()
    cep: Number;

    @Column()
    cidade: String;

    @Column()
    uf: String;

    @Column()
    data_nascimento: Date;

    @OneToMany(() => Venda, venda => venda.cliente)
    vendas: Venda[];
}