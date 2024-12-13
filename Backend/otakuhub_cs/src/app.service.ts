import { Injectable, Inject } from '@nestjs/common';
import * as oracledb from 'oracledb';

@Injectable()
export class AppService {
  constructor(@Inject('ORACLE_CONNECTION') private pool: oracledb.Pool) { }

  async useQuery(query: string, params: any[]): Promise<any> {
    let connection: oracledb.Connection;
    try {
      console.log('Consulta SQL:', query);
      console.log('Parámetros:', params);

      connection = await this.pool.getConnection();
      const result = await connection.execute(query, params, {
        autoCommit: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });

      console.log('Resultado:', result);
      return { success: true, message: 'Registro creado con éxito', id: result.lastRowid };
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
