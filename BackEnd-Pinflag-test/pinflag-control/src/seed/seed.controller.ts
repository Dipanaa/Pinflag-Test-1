import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(
    private readonly seedService: SeedService,
  ) { }

  @Post('ejecutarseed')
  ejecutarSeed() {
    return this.seedService.ejecutarSeedReglas();
  }

  // Usar con precaucion !!
  @Post('borrarseed')
  async eliminarTablasBD() {
    return this.seedService.eliminarTablasBD();
  }

}
