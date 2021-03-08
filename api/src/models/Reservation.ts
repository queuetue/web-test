import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { InventoryItem } from "./InventoryItem";
import { Restaurant } from "./Restaurant";

@Table({ tableName: 'reservations' })
export class Reservation extends Model<Reservation> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @ForeignKey(() => InventoryItem)
  inventoryItemId: number

  @BelongsTo(() => InventoryItem)
  inventoryItem: InventoryItem

  @Column
  name: string

  @Column
  email: string

  @Column
  party_size: number

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string
}
