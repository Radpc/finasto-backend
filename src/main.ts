import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ErrorCode } from './common/errors/error-code';
import { ErrorResponseDTO } from './common/errors/error-response.dto';

const DEFAULT_DEV_ORIGINS = ['http://localhost:5173'];

function corsOrigins(): string[] {
  const configured = process.env.CORS_ORIGINS?.split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  return configured?.length ? configured : DEFAULT_DEV_ORIGINS;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({ origin: corsOrigins() });

  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction || process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Finasto API')
      .setDescription(
        [
          'Shared household cost control.',
          '',
          'Successful responses are `{ data }`; lists are `{ data: { items, pagination: { page, pageSize, total } } }`.',
          'Errors are `{ statusCode, code, message, details? }` (schema `ErrorResponseDTO`). Clients should switch on `code`:',
          '',
          Object.values(ErrorCode)
            .map((code) => `\`${code}\``)
            .join(', '),
        ].join('\n'),
      )
      .setVersion('1.0')
      .addApiKey(
        { type: 'apiKey', name: 'x-api-key', in: 'header' },
        'x-api-key',
      )
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ErrorResponseDTO],
    });
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
