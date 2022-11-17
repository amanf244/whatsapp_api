import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { init, cleanup } from './whatsapp.js'
import * as nodeCleanup from 'node-cleanup'

const HOST = process.env.HOST || undefined
const PORT = parseInt(process.env.PORT) || 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const listenerCallback = () => {
    init()
    console.log(`Server is listening on http://${HOST ? HOST : 'localhost'}:${PORT}`)
  }
  if (HOST) {
    await app.listen(PORT, HOST, listenerCallback);
  } else {
    await app.listen(PORT, listenerCallback);
  }
  nodeCleanup(cleanup)
}
bootstrap();
