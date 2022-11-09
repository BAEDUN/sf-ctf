import { ApiProperty } from "@nestjs/swagger";

export class SubmitRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty()
  readonly title!: string;

  @ApiProperty()
  readonly flag!: string;

  public validate() {
    return this.accessToken && this.title && this.flag;
  }
}

export class SubmitResponseDto {
  @ApiProperty()
  readonly success!: boolean;
}
