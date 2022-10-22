import { ApiProperty } from "@nestjs/swagger";

export class GetChallengeRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty()
  readonly title!: string;
}

export class GetChallengeResponseDto {
  @ApiProperty()
  readonly title!: string;

  @ApiProperty()
  readonly description!: string;

  @ApiProperty({
    type: "array",
    items: {
      type: "object",
      properties: {
        fileName: { type: "string" },
        fileId: { type: "string" },
      },
    },
  })
  readonly fileList!: { fileName: string; fileId: string }[];

  @ApiProperty()
  readonly score!: number;
}
