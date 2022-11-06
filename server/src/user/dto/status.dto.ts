import { ApiProperty } from "@nestjs/swagger";

export class StatusRequestDto {
  @ApiProperty()
  readonly accessToken!: string;
}

export class StatusResponseDto {
  @ApiProperty()
  readonly nickname!: string;

  @ApiProperty()
  readonly score!: number;

  @ApiProperty()
  readonly solvedChallengeTitles!: string[];
}
