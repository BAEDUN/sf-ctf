import { ApiProperty } from "@nestjs/swagger";

export class LoginRequestDto {
  @ApiProperty()
  readonly id!: string;
  @ApiProperty()
  readonly password!: string;
}

export class LoginResponseDto {
  @ApiProperty()
  readonly accessToken!: string;
}
