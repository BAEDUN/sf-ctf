import { ApiProperty } from "@nestjs/swagger";

export class RegisterRequestDto {
  @ApiProperty()
  readonly username!: string;
  @ApiProperty()
  readonly email!: string;
  @ApiProperty()
  readonly password!: string;
  @ApiProperty()
  readonly nickname!: string;
  @ApiProperty()
  readonly isAdmin!: boolean;
  @ApiProperty()
  readonly isBanned!: boolean;
  @ApiProperty({
    enum: ["Security", "Software", "SecurityFirst"],
  })
  readonly section!: string;
}
