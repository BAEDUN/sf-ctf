import { ApiProperty } from "@nestjs/swagger";
import { Category } from "../../challenge/schemas/challenge.schema";

export class StatusRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  public validate() {
    return !!this.accessToken;
  }
}

export class StatusResponseDto {
  @ApiProperty()
  readonly username!: string;

  @ApiProperty()
  readonly nickname!: string;

  @ApiProperty()
  readonly score!: number;

  @ApiProperty({
    type: "array",
    items: {
      type: "object",
      properties: {
        title: { type: "string" },
        category: {
          type: "enum",
          enum: [
            Category.Forensic,
            Category.Misc,
            Category.Pwnable,
            Category.Reversing,
            Category.Web,
          ],
        },
        solvedAt: { type: "string" },
      },
    },
  })
  readonly solvedChallenges!: {
    title: string;
    category: Category;
    solvedAt: string;
  }[];

  @ApiProperty()
  readonly email!: string;
}
