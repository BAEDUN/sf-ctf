import { ApiProperty } from "@nestjs/swagger";

export class GetSolversRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty()
  readonly challengeTitle!: string;

  @ApiProperty({
    description: "Zero based page index. 10 per page",
  })
  readonly page!: number;
}

export class GetSolversResponseDto {
  @ApiProperty({
    type: "array",
    items: {
      type: "object",
      properties: {
        solvedAt: { type: "string" },
        username: { type: "string" },
      },
    },
  })
  readonly logs!: {
    solvedAt: Date;
    username: string;
  }[];

  @ApiProperty({
    description: "Total pages for submitted query",
  })
  readonly pages!: number;
}
