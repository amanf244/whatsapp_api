import { Controller, Get, HttpCode, Param, Post, Req, Res, Delete } from '@nestjs/common';
import {
  isSessionExists,
  createSession,
  getSession,
  deleteSession,
  isExists,
} from '../../whatsapp.js';
import response from '../../response.js';
import sessionValidator from '../../middlewares/sessionValidator.js';
import { Request, Response } from 'express';

@Controller('session')
export class SessionController {
  @Get(':id')
  get(@Res() res: Response) {
    response(res, 200, true, 'Session found.');
  }

  @Post('add')
  @HttpCode(201)
  chat(@Req() req: Request, @Res() res: Response) {
    const { id, isLegacy } = req.body;

    if (isSessionExists(id)) {
      return response(
        res,
        409,
        false,
        'Session already exists, please use another id.',
      );
    }

    createSession(id, isLegacy === 'true', res);
  }

  @Get('status/:id')
  async status(@Req() req, @Res() res, @Param() param){
    const states = ['connecting', 'connected', 'disconnecting', 'disconnected']
    try {
      const exists = isSessionExists(param.id);
      if (!exists){
        return response(res, 400, false, 'Session is not exists.')
      }

      const session = await getSession(param.id)
      let state = states[session.ws.readyState]
      state =
      state === 'connected' && typeof (session.isLegacy ? session.state.legacy.user : session.user) !== 'undefined'
          ? 'authenticated'
          : state
  
          response(res, 200, true, '', { status: state })
    } catch (error) {
      response(error, 400, false)
    }
  }
  
  @Delete('delete/:id')
  async deleteSessions(@Req() req, @Res() res, @Param() param){
    const { id } = param
    const session = getSession(id)

    if (!isSessionExists(id)){
      return response(res, 400, false, 'Session is not exists.')
    }

    try {
        await session.logout()
    } catch {
    } finally {
        deleteSession(id, session.isLegacy)
    }

    response(res, 200, true, 'The session has been successfully deleted.')
  }
  
}
