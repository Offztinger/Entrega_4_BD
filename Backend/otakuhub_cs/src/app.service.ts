import { Injectable, Inject } from '@nestjs/common';
import * as oracledb from 'oracledb';

@Injectable()
export class AppService {
  constructor(@Inject('ORACLE_CONNECTION') private pool: oracledb.Pool) { }

  async getQuery(query: string, params: any[]): Promise<any> {
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

  async createQuery(query: string, params: any[]): Promise<any> {
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

  async updateQuery(query: string, params: any[]): Promise<any> {
    let connection: oracledb.Connection;
    try {
      connection = await this.pool.getConnection();
      const result = await connection.execute(query, params, {
        autoCommit: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });

      console.log('Resultado:', result);
      return { success: true, message: 'Registro actualizado con éxito' };
    } catch (err) {
      console.error('Error al ejecutar la consulta:', err);
      throw err;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  async deleteQuery(query: string, params: any[]): Promise<any> {
    let connection: oracledb.Connection;
    try {
      console.log('Consulta SQL para eliminar:', query);
      console.log('Parámetros:', params);
  
      connection = await this.pool.getConnection();
      const result = await connection.execute(query, params, {
        autoCommit: true, // Confirma automáticamente los cambios
      });
  
      console.log('Resultado de la eliminación:', result);
      return { success: true, message: 'Registro eliminado con éxito' };
    } catch (err) {
      console.error('Error al ejecutar la consulta de eliminación:', err);
      throw err;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
  

}