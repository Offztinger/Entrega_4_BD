import { Controller, Get, Post, Put, Delete, Query, Body, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('animes') // Prefijo de ruta para todas las operaciones
export class AppController {
  constructor(private readonly appService: AppService) { }

  // GET: Obtener un anime por ID
  @Get('/id')
  async getQueryById(@Query('id', ParseIntPipe) id: number) {
    console.log('ID recibido:', id);
    const query = 'SELECT * FROM BDOO.ANIMES WHERE ID_ANV = :1';
    return this.appService.getQuery(query, [id]);
  }

  @Get('/all')
  async getQuery() {
    const query = 'SELECT * FROM BDOO.ANIMES';
    return this.appService.getQuery(query, []);
  }

  // POST: Crear un nuevo anime
  @Post()
  async createAnime(@Body() body: {
    nombre: string;
    descripcion?: string;
    generos?: string;
    estado?: string;
    imagen?: string;
    puntuacion?: number;
    totalCapitulos?: number;
    estudios?: string;
    plataformas?: string;
  }) {
    console.log('Datos recibidos para crear:', body);

    // Validar el campo "puntuacion" para que cumpla con las restricciones de la columna
    if (body.puntuacion && (body.puntuacion > 9.9 || body.puntuacion < 0)) {
      throw new Error('El campo "puntuacion" debe estar entre 0.0 y 9.9');
    }

      const query = `INSERT INTO BDOO.ANIMES (
        ID_ANV, NOMBRE_ANV, DESCRIPCION_ANV, IMAGEN_ANV, 
        PUNTUACION_ANV, TOTAL_CAPITULOS_ANV, ESTADOS_OBJ_DATA, 
        GENEROS_OBJ_DATA, PLATAFORMAS_OBJ_DATA, ESTUDIOS_OBJ_DATA
      ) VALUES (
        BDOO.SEQ_ANIMES_ID.NEXTVAL, :1, :2, :3,
        :4, :5, BDOO.ESTADOS_OBJ(BDOO.SEQ_ESTADOS_ID.NEXTVAL, :6),
        BDOO.GENEROS_OBJ(BDOO.SEQ_GENEROS_ID.NEXTVAL, :7),
        BDOO.PLATAFORMAS_OBJ(BDOO.SEQ_PLATAFORMAS_ID.NEXTVAL, :8),
        BDOO.ESTUDIOS_OBJ(BDOO.SEQ_ESTUDIOS_ID.NEXTVAL, :9)
      )`;

    const params = [
      body.nombre,                  // NOMBRE_ANV
      body.descripcion || null,     // DESCRIPCION_ANV
      body.imagen || null,          // IMAGEN_ANV
      body.puntuacion || null,      // PUNTUACION_ANV
      body.totalCapitulos || null,  // TOTAL_CAPITULOS_ANV
      body.estado || null,          // NOMBRE_EST
      body.generos || null,         // NOMBRE_GEN
      body.plataformas || null,     // NOMBRE_PTF
      body.estudios || null         // NOMBRE_STD
    ];

    return this.appService.createQuery(query, params);
  }

  @Put()
  async updateAnime(@Body() body: {
    id: number; // ID del anime
    nombre: string;
    descripcion?: string;
    imagen?: string;
    puntuacion?: number;
    totalCapitulos?: number;
    estado: { id: number, nombre: string };
    generos: { id: number, nombre: string };
    plataformas: { id: number, nombre: string };
    estudios: { id: number, nombre: string };
  }) {
    console.log('Datos recibidos para actualizar:', body);

    // Validación de que el ID existe
    if (!body.id) {
      throw new Error('El campo "id" es obligatorio');
    }

    const query = `
      UPDATE BDOO.ANIMES SET
        NOMBRE_ANV = :2,
        DESCRIPCION_ANV = :3,
        IMAGEN_ANV = :4,
        PUNTUACION_ANV = :5,
        TOTAL_CAPITULOS_ANV = :6,
        ESTADOS_OBJ_DATA = BDOO.ESTADOS_OBJ(:7, :8),
        GENEROS_OBJ_DATA = BDOO.GENEROS_OBJ(:9, :10),
        PLATAFORMAS_OBJ_DATA = BDOO.PLATAFORMAS_OBJ(:11, :12),
        ESTUDIOS_OBJ_DATA = BDOO.ESTUDIOS_OBJ(:13, :14)
      WHERE ID_ANV = :1`;

    const params = [
      body.id, // ID_ANV
      body.nombre || null, // NOMBRE_ANV
      body.descripcion || null, // DESCRIPCION_ANV
      body.imagen || null, // IMAGEN_ANV
      body.puntuacion || null, // PUNTUACION_ANV
      body.totalCapitulos || null, // TOTAL_CAPITULOS_ANV
      body.estado.id || null, // ID_EST
      body.estado.nombre || null, // NOMBRE_EST
      body.generos.id || null, // ID_GEN
      body.generos.nombre || null, // NOMBRE_GEN
      body.plataformas.id || null, // ID_PTF
      body.plataformas.nombre || null, // NOMBRE_PTF
      body.estudios.id || null, // ID_STD
      body.estudios.nombre || null // NOMBRE_STD
    ];

    console.log('Parámetros enviados al servicio:', params);

    return this.appService.updateQuery(query, params);
  }

  @Delete()
  async deleteAnime(@Query('id', ParseIntPipe) id: number) {
    console.log('ID recibido para eliminar:', id);

    if (!id) {
      throw new Error('El campo "id" es obligatorio');
    }

    const query = 'DELETE FROM BDOO.ANIMES WHERE ID_ANV = :1';
    return this.appService.deleteQuery(query, [id]);
  }
}