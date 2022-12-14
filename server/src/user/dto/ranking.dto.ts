import { ApiProperty } from "@nestjs/swagger";
import { Section } from "../schemas/user.schema";

export class RankingRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty({
    required: false,
    type: "enum",
    enum: [Section.Security, Section.SecurityFirst, Section.Software],
  })
  readonly section?: Section | undefined;

  @ApiProperty({
    description: "Zero based page index. 15 users per page",
  })
  readonly page!: number;
}

export function validateRankingRequestDto(body: RankingRequestDto) {
  if (!body.accessToken || body.page < 0) {
    return false;
  }
  switch (body.section) {
    case Section.Security:
    case Section.SecurityFirst:
    case Section.Software:
    case undefined:
      return true;

    default:
      return false;
  }
}

export class RankingResponseDto {
  @ApiProperty({
    type: "array",
    items: {
      type: "object",
      properties: {
        rank: { type: "number" },
        username: { type: "string" },
        score: { type: "number" },
      },
    },
  })
  readonly users!: {
    rank: number;
    username: string;
    score: number;
  }[];

  @ApiProperty({
    description: "Total pages for requested query",
  })
  readonly pages!: number;
}
