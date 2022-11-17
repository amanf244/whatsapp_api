import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { SessionController } from './session/controllers/session.controller';

@Module({
  imports: [ChatModule],
  controllers: [AppController, SessionController],
  providers: [AppService],
})
export class AppModule {}
