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
  DataType
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

  @Column({ type: DataType.INTEGER, allowNull: false })
  dayNumber: number

  @Column({ type: DataType.INTEGER, allowNull: false })
  blockNumber: number

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  seatCount: number

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  bookedCount: number

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  availableCount: number

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string
}
