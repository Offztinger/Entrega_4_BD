
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as oracledb from 'oracledb';
import * as cors from 'cors';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'ORACLE_CONNECTION',
      useFactory: async () => {
        try {
          await oracledb.createPool({
            user: 'BDOO',
            password: '123',
            connectString: 'localhost:1521',
          });

          console.log('Conexión a Oracle creada correctamente');
          return oracledb.getPool();
        } catch (err) {
          console.error('Error al conectar con Oracle:', err);
          throw err;
        }
      },
    },
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cors({
          origin: '*', // Permitir este origen
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Métodos permitidos
          allowedHeaders: [
            'Content-Type',
            'Authorization',
            'ngrok-skip-browser-warning', // Encabezado permitido
          ],
          credentials: true, // Permitir cookies o credenciales
        }),
      )
      .forRoutes('*'); // Aplica CORS a todas las rutas
  }
}

