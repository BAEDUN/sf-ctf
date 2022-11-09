import { ApiProperty } from "@nestjs/swagger";

export class GetRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty()
  readonly filename!: string;

  public validate() {
    return this.accessToken && this.filename;
  }
}

export class GetResponseDto {
  @ApiProperty()
  readonly presignedUrl!: string;
}
