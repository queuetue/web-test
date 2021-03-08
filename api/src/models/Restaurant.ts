import {
  BelongsToMany,
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey, Table,
  UpdatedAt
} from 'sequelize-typescript'

import { InventoryItem } from "./InventoryItem";
import { Reservation } from "./Reservation";

@Table({ tableName: 'restaurants' })
export class Restaurant extends Model<Restaurant> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @HasMany(() => InventoryItem)
  inventory_items: InventoryItem

  @Column
  name: string

  @Column
  address: string

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string
}
