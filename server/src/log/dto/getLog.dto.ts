import { ApiProperty } from "@nestjs/swagger";
import { LogType } from "../schemas/log.schema";

export class GetLogRequestDto {
  @ApiProperty()
  readonly accessToken!: string;

  @ApiProperty({
    required: false,
  })
  readonly username?: string;

  @ApiProperty({
    required: false,
  })
  readonly ip?: string;

  @ApiProperty({
    description: "Zero based page index. 25 logs per page",
  })
  readonly page!: number;
}

export class GetLogResponseDto {
  @ApiProperty({
    type: "array",
    items: {
      type: "object",
      properties: {
        createdAt: { type: "string" },
        ip: { type: "string" },
        username: { type: "string" },
        type: {
          type: "enum",
          enum: [LogType.Login, LogType.Download, LogType.Submit],
        },
        filename: { type: "string" },
        flag: { type: "string" },
        solved: { type: "boolean" },
      },
    },
  })
  readonly logs!: {
    createdAt: Date;
    ip: string;
    username: string;
    type: LogType;
    filename: string;
    flag: string;
    solved: boolean;
  }[];

  @ApiProperty({
    description: "Total pages for submitted query",
  })
  readonly pages!: number;
}
