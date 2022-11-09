import { ApiProperty } from "@nestjs/swagger";

export class ManageUserRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty()
  readonly username!: string;

  @ApiProperty()
  readonly ban!: boolean;

  @ApiProperty()
  readonly admin!: boolean;
}
