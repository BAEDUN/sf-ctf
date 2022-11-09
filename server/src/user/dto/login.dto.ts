import { ApiProperty } from "@nestjs/swagger";

export class LoginRequestDto {
  @ApiProperty()
  readonly username!: string;
  @ApiProperty()
  readonly password!: string;
}

export function validateLoginRequestDto(body: LoginRequestDto) {
  return body.username && body.password;
}

export class LoginResponseDto {
  @ApiProperty()
  readonly accessToken!: string;
}
