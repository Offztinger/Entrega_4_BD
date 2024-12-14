
import { Module } from '@nestjs/common';
import * as oracledb from 'oracledb';
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
export class AppModule { }
