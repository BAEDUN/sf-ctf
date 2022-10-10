import { ApiProperty } from "@nestjs/swagger";

export class RegisterRequestDto {
  @ApiProperty()
  readonly id!: string;
  @ApiProperty()
  readonly email!: string;
  @ApiProperty()
  readonly password!: string;
  @ApiProperty()
  readonly nickname!: string;
  @ApiProperty()
  readonly studentIdNumber!: string;
  @ApiProperty()
  readonly realName!: string;
  @ApiProperty()
  readonly isAdmin!: boolean;
  @ApiProperty()
  readonly isBanned!: boolean;
  @ApiProperty({ enum: ["OB", "YB"] })
  readonly section!: string;
}
