import { Module } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';

@Module({
  providers: [TransformInterceptor],
  exports: [TransformInterceptor],
})
export class CommonModule {}
