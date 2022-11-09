import { ApiProperty } from "@nestjs/swagger";
import { Section } from "../schemas/user.schema";
import validatePassword from "../util/validatePassword";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const NICK_REGEX = /^[0-9]{2}_[ㄱ-ㅎㅏ-ㅣ가-힣]{2,5}$/;

export class RegisterRequestDto {
  @ApiProperty()
  readonly username!: string;

  @ApiProperty()
  readonly email!: string;

  @ApiProperty()
  readonly password!: string;

  @ApiProperty()
  readonly nickname!: string;

  @ApiProperty({
    enum: ["Security", "Software", "SecurityFirst"],
  })
  readonly section!: Section;

  public validate() {
    if (
      !this.username ||
      !this.email ||
      !this.password ||
      !this.nickname ||
      !this.section
    ) {
      return false;
    }

    if (
      !USER_REGEX.test(this.username) ||
      !EMAIL_REGEX.test(this.email) ||
      !validatePassword(this.password) ||
      !NICK_REGEX.test(this.nickname)
    ) {
      return false;
    }

    switch (this.section) {
      case Section.Security:
      case Section.SecurityFirst:
      case Section.Software:
      case undefined:
        return true;

      default:
        return false;
    }
  }
}
