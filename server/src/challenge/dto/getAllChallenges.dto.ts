import { ApiProperty } from "@nestjs/swagger";
import { Category } from "../schemas/challenge.schema";

export class GetAllChallengesRequestDto {
  @ApiProperty()
  readonly accessToken!: string;
}

export class GetAllChallengesResponseDto {
  @ApiProperty({
    type: "array",
    items: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        category: {
          type: "enum",
          enum: [
            Category.Web,
            Category.Forensic,
            Category.Pwnable,
            Category.Reversing,
            Category.Misc,
          ],
        },
        fileList: {
          type: "array",
          items: { type: "string" },
        },
        score: { type: "number" },
        solved: { type: "boolean" },
      },
    },
  })
  readonly challenges!: {
    title: string;
    description: string;
    category: Category;
    fileList: string[];
    score: number;
    solved: boolean;
  }[];
}
