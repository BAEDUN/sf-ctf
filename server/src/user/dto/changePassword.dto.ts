import { ApiProperty } from "@nestjs/swagger";
import validatePassword from "../util/validatePassword";

export class ChangePasswordRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty()
  readonly oldPassword!: string;

  @ApiProperty()
  readonly newPassword!: string;

  public validate() {
    if (!this.accessToken || !this.oldPassword || !this.newPassword) {
      return false;
    }

    return validatePassword(this.newPassword);
  }
}
