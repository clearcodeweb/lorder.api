import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiModelProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email: string;
}
