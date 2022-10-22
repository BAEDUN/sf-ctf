import { ApiProperty } from "@nestjs/swagger";

export class PutRequestDto {
  @ApiProperty()
  readonly accessToken!: string;
}

export class PutResponseDto {
  @ApiProperty()
  readonly fileId!: string;

  @ApiProperty()
  readonly presignedUrl!: string;
}
