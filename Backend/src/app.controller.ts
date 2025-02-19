import { Controller, Get, Logger, Redirect } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //main we need to redirect to the swagger documentation
  @Get()
  @Redirect('/docs')
  @ApiExcludeEndpoint()
  redirectToSwagger() {
    Logger.log('Redirecting to Swagger');
  }

  @ApiOperation({ summary: 'Check the health of the service' })
  @ApiResponse({
    status: 200,
    description: 'The service is up and running.',
  })
  @Get('health-check')
  getCheckHealth(): string {
    return this.appService.getHello();
  }
}
