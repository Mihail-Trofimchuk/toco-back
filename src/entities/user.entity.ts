import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { CoreEntity } from "./core.entity";

@Entity("user")
export class UserEntity extends CoreEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ type: "varchar", nullable: true })
  username: string;

  @Column({ type: "varchar", nullable: false })
  email: string;

  @Column({ type: "varchar", nullable: true })
  role: "tocos" | "user";

  @Column({ type: "varchar", nullable: false })
  password: string;

  @Column({ type: "varchar", length: 42, nullable: true })
  walletAddress: string;
}
