import { ApiProperty } from "@nestjs/swagger";

export class PutRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty()
  readonly filename!: string;
}

export class PutResponseDto {
  @ApiProperty()
  readonly presignedUrl!: string;
}
