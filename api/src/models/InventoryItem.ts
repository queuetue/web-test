import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { Restaurant } from './Restaurant'
import { Reservation } from "./Reservation";

@Table({ tableName: 'inventoryitems' })
export class InventoryItem extends Model<InventoryItem> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @ForeignKey(() => Restaurant)
  restaurantId: number

  @BelongsTo(() => Restaurant)
  restaurant: Restaurant

  @HasMany(() => Reservation)
  reservations: Reservation

  @Column
  reservation_at: Date

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string
}
