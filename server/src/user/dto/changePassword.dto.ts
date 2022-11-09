import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty()
  readonly oldPassword!: string;

  @ApiProperty()
  readonly newPassword!: string;
}
