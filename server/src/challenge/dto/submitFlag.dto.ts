import { ApiProperty } from "@nestjs/swagger";

export class SubmitRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty()
  readonly title!: string;

  @ApiProperty()
  readonly flag!: string;
}

export function validateSubmitRequestDto(body: SubmitRequestDto) {
  return body.accessToken && body.title && body.flag;
}

export class SubmitResponseDto {
  @ApiProperty()
  readonly success!: boolean;
}
