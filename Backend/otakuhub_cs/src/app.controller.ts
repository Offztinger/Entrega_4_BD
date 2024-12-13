import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async obtenerDatos(@Query('id', ParseIntPipe) id: number) {
    console.log('ID recibido:', id);
    const query = 'SELECT NOMBRE_ANV FROM ANIMES WHERE ID_ANV = 1';
return this.appService.obtenerDatos(query, []);
    // const query = 'SELECT NOMBRE_ANV FROM ANIMES WHERE ID_ANV = :1';
    // return this.appService.obtenerDatos(query, [id]);
  }
}
