import { ApiProperty } from '@nestjs/swagger';

export class CancelOrderResponseDto {
  @ApiProperty({
    description: 'Whether a refund was processed for this cancellation',
    example: true,
    type: Boolean
  })
  refund: boolean;

}
