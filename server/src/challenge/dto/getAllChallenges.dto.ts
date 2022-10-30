import { ApiProperty } from "@nestjs/swagger";

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
        score: { type: "number" },
      },
    },
  })
  readonly challenges!: {
    title: string;
    description: string;
    score: number;
  }[];
}
