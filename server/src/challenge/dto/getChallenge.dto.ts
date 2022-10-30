import { ApiProperty } from "@nestjs/swagger";
import { Category } from "../schemas/challenge.schema";

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
    enum: [
      Category.Web,
      Category.Forensic,
      Category.Pwnable,
      Category.Reversing,
      Category.Misc,
    ],
  })
  category!: Category;

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
