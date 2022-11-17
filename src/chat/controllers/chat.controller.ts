import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  getSession,
  getChatList,
  isExists,
  sendMessage,
  formatPhone,
} from './../../whatsapp';
import response from './../../response';
import { CreateChatDto } from 'src/chat/dto/CreateChat.dto';

@Controller('chat')
export class ChatController {
  constructor() {}

  // Kirim pesan
  @Post(':id')
   async sendMessage(@Req() req: Request, @Res() res: Response, @Param() param) {
      const session = getSession(param.id)
      const receiver = formatPhone(req.body.receiver)
      const { message } = req.body
      const { location } = req.body

      const templateButtons = [
        {index: 1, urlButton: {displayText: '⭐ Star Baileys on GitHub!', url: 'https://github.com/adiwajshing/Baileys'}},
        {index: 2, callButton: {displayText: 'Call me!', phoneNumber: '+1 (234) 5678-901'}},
        {index: 3, quickReplyButton: {displayText: 'This is a reply, just like normal buttons!', id: 'id-like-buttons-message'}},
    ]
    
    const templateMessage = {
        text: "Hi it's a template message",
        footer: 'Hello World',
        templateButtons: templateButtons
    }

    console.log("tes1",templateMessage);
    console.log("tes2", req.body);
    
    
      try {
          const exists = await isExists(session, receiver)

          if (!exists) {
              return response(res, 400, false, 'The receiver number is not exists.')
          }

          if (req.body.message)
          {
            console.log("message",req.body.message);
            await sendMessage(session, receiver, message, '0')
          } else if(req.body.location) {
            // console.log("location",req.body.location);
            await sendMessage(session, receiver, { location: location}, '0')
          } else if(req.body.buttons) {
            await sendMessage(session, receiver, req.body)
          } else if(req.body.templateButtons){
            await sendMessage(session, receiver, req.body)
          }

          return response(res, 200, true, 'The message has been successfully sent.')
      } catch {
          return response(res, 500, false, 'Failed to send the message.')
      }
  }

  //pesan broadcast
  @Post('broadcast/:id')
    async broadcats(@Req() req, @Res() res, @Param() param){
      const session = getSession(param.id)
      const errors = []
  
      for (const [key, data] of req.body.entries()) {
          let { receiver, message, delay } = data
  
          if (!receiver || !message) {
              errors.push(key)
  
              continue
          }
  
          if (!delay || isNaN(delay)) {
              delay = 1000
          }
  
          receiver = formatPhone(receiver)
  
          try {
              const exists = await isExists(session, receiver)
  
              if (!exists) {
                  errors.push(key)
  
                  continue
              }
  
              await sendMessage(session, receiver, message, delay)
          } catch {
              errors.push(key)
          }
      }
  
      if (errors.length === 0) {
          return response(res, 200, true, 'All messages has been successfully sent.')
      }
  
      const isAllFailed = errors.length === req.body.length
  
      response(
          res,
          isAllFailed ? 500 : 200,
          !isAllFailed,
          isAllFailed ? 'Failed to send all messages.' : 'Some messages has been successfully sent.',
          { errors }
      )
    }
}
