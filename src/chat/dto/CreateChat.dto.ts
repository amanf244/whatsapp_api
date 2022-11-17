import { IsNotEmpty, minLength } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  nama: string;

  @IsNotEmpty()
  receiver: string;

  @IsNotEmpty()
  message: string;
}
