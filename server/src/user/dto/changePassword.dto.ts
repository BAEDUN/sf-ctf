import { ApiProperty } from "@nestjs/swagger";
import validatePassword from "../util/validatePassword";

export class ChangePasswordRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty()
  readonly oldPassword!: string;

  @ApiProperty()
  readonly newPassword!: string;
}

export function validateChangePasswordRequestDto(
  body: ChangePasswordRequestDto
) {
  if (!body.accessToken || !body.oldPassword || !body.newPassword) {
    return false;
  }

  return validatePassword(body.newPassword);
}
