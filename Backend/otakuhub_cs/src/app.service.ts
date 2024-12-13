import { Injectable, Inject } from '@nestjs/common';
import * as oracledb from 'oracledb';

@Injectable()
export class AppService {
  constructor(@Inject('ORACLE_CONNECTION') private pool: oracledb.Pool) { }

  async obtenerDatos(query: string, params: any[]): Promise<any> {
    let connection: oracledb.Connection;
    try {
      console.log('Conexión establecida.');
      console.log('Consulta a ejecutar:', query);
      console.log('Parámetros:', params);

      connection = await this.pool.getConnection();
      const result = await connection.execute(query, params, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });

      console.log('Resultado de la consulta:', result);
      return result.rows;
    } catch (err) {
      console.error('Error al ejecutar la consulta:', err);
      throw err;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

}
