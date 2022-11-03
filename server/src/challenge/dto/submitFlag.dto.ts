import { ApiProperty } from "@nestjs/swagger";

export class SubmitRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty()
  readonly title!: string;

  @ApiProperty()
  readonly flag!: string;
}

export class SubmitResponseDto {
  @ApiProperty()
  readonly success!: boolean;
}
