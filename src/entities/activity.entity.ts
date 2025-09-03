import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { CoreEntity } from "./core.entity";
import { UserEntity } from "./user.entity";

@Entity("activity")
export class ActivityEntity extends CoreEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ type: "varchar", nullable: false })
  title: string;

  @Column({ type: "varchar", nullable: false })
  description: string;

  @Column({ type: "int", nullable: false })
  reward: number;

  @Column({ type: "varchar", nullable: true})
  status: null | "pending" | "finished" | "closed" = null

  @ManyToOne(() => UserEntity, (user) => user.uuid, { nullable: false })
  client: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.uuid, { nullable: true })
  participant: UserEntity | null = null;
}
