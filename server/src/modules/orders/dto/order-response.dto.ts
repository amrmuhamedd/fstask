import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty({
    description: 'The unique identifier for the order',
    example: 1,
    type: Number
  })
  id: number;

  @ApiProperty({
    description: 'The store ID associated with this order',
    example: 101,
    type: Number
  })
  store_id: number;

  @ApiProperty({
    description: 'The customer ID associated with this order',
    example: 201,
    type: Number
  })
  customer_id: number;

  @ApiProperty({
    description: 'The name of the store',
    example: 'Electronics Store',
    type: String
  })
  store_name: string;

  @ApiProperty({
    description: 'The name of the customer',
    example: 'John Doe',
    type: String
  })
  customer_name: string;

  @ApiProperty({
    description: 'The current status of the order',
    example: 'CONFIRMED',
    enum: ['CONFIRMED', 'CANCELLED', 'PENDING'],
    type: String
  })
  status: string;

  @ApiProperty({
    description: 'The order amount in cents',
    example: 12500,
    type: Number
  })
  amount_cents: number;

  @ApiProperty({
    description: 'The date when the order was created',
    example: '2025-09-10T10:30:00.000Z',
    type: Date
  })
  created_at: Date;

  @ApiProperty({
    description: 'The date when the order was last updated',
    example: '2025-09-10T15:45:00.000Z',
    type: Date
  })
  updated_at: Date;
}
