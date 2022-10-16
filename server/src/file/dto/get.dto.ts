import { ApiProperty } from "@nestjs/swagger";

export class GetRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty()
  readonly fileId!: string;
}

export class GetResponseDto {
  @ApiProperty()
  readonly presignedUrl!: string;
}
