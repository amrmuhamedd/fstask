import { Controller, Delete, Get, Param, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderWithRelations } from '@/database/repositories/interfaces/order.repository.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderResponseDto } from './dto/order-response.dto';

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
  cancelOrder(@Param('id') id: string, @Body() body: { refund: boolean }) {
    return this.ordersService.cancelOrder(id, body.refund);
  }
}
