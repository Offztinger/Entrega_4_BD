import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS para permitir el encabezado personalizado
  app.enableCors({
    origin: '*', // Permitir solicitudes solo desde este origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Métodos permitidos
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'ngrok-skip-browser-warning', // Incluir el encabezado personalizado
    ],
    credentials: true, // Permitir cookies o credenciales
  });

  await app.listen(3000);
}
bootstrap();
