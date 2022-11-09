import { ApiProperty } from "@nestjs/swagger";

export class GetUsersRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty({
    required: false,
  })
  readonly username?: string;

  @ApiProperty({
    required: false,
  })
  readonly nickname?: string;

  @ApiProperty({
    description: "Zero based page index. 15 users per page",
  })
  readonly page!: number;
}

export class GetUsersResponseDto {
  @ApiProperty({
    type: "array",
    items: {
      type: "object",
      properties: {
        username: { type: "string" },
        nickname: { type: "string" },
        isAdmin: { type: "boolean" },
        isBanned: { type: "boolean" },
      },
    },
  })
  readonly users!: {
    username: string;
    nickname: string;
    isAdmin: boolean;
    isBanned: boolean;
  }[];

  @ApiProperty({
    description: "Total pages for requested query",
  })
  readonly pages!: number;
}
