import { ApiProperty } from "@nestjs/swagger";
import { Category } from "../schemas/challenge.schema";

export class CreateChallengeRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

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

  @ApiProperty({
    type: "object",
    properties: {
      minimumScore: { type: "number" },
      maximumScore: { type: "number" },
      maximumSolvedUserCount: { type: "number" },
    },
  })
  readonly grading!: {
    minimumScore: number;
    maximumScore: number;
    maximumSolvedUserCount: number;
  };

  @ApiProperty()
  readonly flag!: string;
}
