import { ApiProperty } from "@nestjs/swagger";
import { Section } from "../schemas/user.schema";

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
}
