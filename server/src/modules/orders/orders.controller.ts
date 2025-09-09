import { Controller, Delete, Get, Param, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderWithRelations } from '@/database/repositories/interfaces/order.repository.interface';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { OrderResponseDto } from './dto/order-response.dto';
import { CancelOrderResponseDto } from './dto/cancel-order-response.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

   @Get('orders')
  @ApiOperation({
    summary: 'Get all orders with relationships',
    description: 'Retrieves a list of all orders including customer and store information'
  })
  @ApiResponse({
    status: 200,
    description: 'List of orders retrieved successfully',
    type: [OrderResponseDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occurred while retrieving orders'
  })
  listOrders(): Promise<OrderWithRelations[]> {
    return this.ordersService.listOrders();
  }


  @Delete('orders/:id')
   @ApiOperation({
    summary: 'Cancel an order',
    description: 'Cancels an existing order and optionally processes a refund if requested'
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the order to cancel',
    type: String,
    required: true,
    example: '42'
  })
  @ApiBody({
    description: 'Cancellation options',
    type: CancelOrderResponseDto
  })
  @ApiResponse({
    status: 200,
    description: 'Order successfully cancelled',
    type: CancelOrderResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Order or store not found'
  })
  @ApiResponse({
    status: 422,
    description: 'Insufficient store balance for refund',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 422 },
        message: { type: 'string', example: 'Cannot process refund due to insufficient store balance' },
        error: { type: 'string', example: 'Insufficient Balance' },
      }
    }
  })
  cancelOrder(@Param('id') id: string, @Body() body: CancelOrderResponseDto) {
    return this.ordersService.cancelOrder(id, body.refund);
  }
}
