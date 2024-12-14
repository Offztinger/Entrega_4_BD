import { Controller, Get, Post, Put, Delete, Query, Body, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('animes') // Prefijo de ruta para todas las operaciones
export class AppController {
  constructor(private readonly appService: AppService) { }

  // GET: Obtener un anime por ID
  @Get()
  async getQuery(@Query('id', ParseIntPipe) id: number) {
    console.log('ID recibido:', id);
    const query = 'SELECT * FROM ANIMES WHERE ID_ANV = :1';
    return this.appService.getQuery(query, [id]);
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

    const query = `INSERT INTO ANIMES (
      ID_ANV, NOMBRE_ANV, DESCRIPCION_ANV, GENEROS_OBJ_DATA,
      ESTADOS_OBJ_DATA, IMAGEN_ANV, PUNTUACION_ANV, TOTAL_CAPITULOS_ANV,
      ESTUDIOS_OBJ_DATA, PLATAFORMAS_OBJ_DATA
    ) VALUES (
      SEQ_ANIMES_ID.NEXTVAL, :1, :2, GENEROS_OBJ(SEQ_GENEROS_ID.NEXTVAL, :3),
      ESTADOS_OBJ(SEQ_ESTADOS_ID.NEXTVAL, :4), :5, :6, :7,
      ESTUDIOS_OBJ(SEQ_ESTUDIOS_ID.NEXTVAL, :8), PLATAFORMAS_OBJ(SEQ_PLATAFORMAS_ID.NEXTVAL, :9)
    )`;

    const params = [
      body.nombre,                  // NOMBRE_ANV
      body.descripcion || null,     // DESCRIPCION_ANV
      body.generos || null,         // NOMBRE_GEN
      body.estado || null,          // NOMBRE_EST
      body.imagen || null,          // IMAGEN_ANV
      body.puntuacion || null,      // PUNTUACION_ANV
      body.totalCapitulos || null,  // TOTAL_CAPITULOS_ANV
      body.estudios || null,        // NOMBRE_STD
      body.plataformas || null      // NOMBRE_PTF
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
  }) {
    console.log('Datos recibidos para actualizar:', body);

    // Validación de que el ID existe
    if (!body.id) {
      throw new Error('El campo "id" es obligatorio');
    }

    const query = `
      UPDATE ANIMES SET
      NOMBRE_ANV = :1,
      DESCRIPCION_ANV = :2,
      IMAGEN_ANV = :3,
      PUNTUACION_ANV = :4,
      TOTAL_CAPITULOS_ANV = :5
      WHERE ID_ANV = ${body.id}`;

    const params = [
      body.nombre || null, // NOMBRE_ANV
      body.descripcion || null, // DESCRIPCION_ANV
      body.imagen || null, // IMAGEN_ANV
      body.puntuacion || null, // PUNTUACION_ANV
      body.totalCapitulos || null, // TOTAL_CAPITULOS_ANV
    ];

    console.log('Parámetros enviados al servicio:', params);

    return this.appService.updateQuery(query, params);
  }


  // DELETE: Eliminar un anime por ID
  // @Delete()
  // async deleteAnime(@Query('id', ParseIntPipe) id: number) {
  //   console.log('ID recibido para eliminar:', id);
  //   const query = 'DELETE FROM ANIMES WHERE ID_ANV = :1';
  //   return this.appService.useQuery(query, [id]);
  // }
}
