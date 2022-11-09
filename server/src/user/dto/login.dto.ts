import { ApiProperty } from "@nestjs/swagger";

export class LoginRequestDto {
  @ApiProperty()
  readonly username!: string;
  @ApiProperty()
  readonly password!: string;

  public validate() {
    return this.username && this.password;
  }
}

export class LoginResponseDto {
  @ApiProperty()
  readonly accessToken!: string;
}
