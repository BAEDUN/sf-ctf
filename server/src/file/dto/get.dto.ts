import { ApiProperty } from "@nestjs/swagger";

export class GetRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty()
  readonly filename!: string;
}

export function validateGetRequestDto(body: GetRequestDto) {
  return body.accessToken && body.filename;
}

export class GetResponseDto {
  @ApiProperty()
  readonly presignedUrl!: string;

  @ApiProperty()
  readonly dummy!: string;
}
