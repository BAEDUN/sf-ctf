import { ApiProperty } from "@nestjs/swagger";

export class GetRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty()
  readonly filename!: string;
}

export class GetResponseDto {
  @ApiProperty()
  readonly presignedUrl!: string;
}
