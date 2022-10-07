export class CreateUserDto {
  readonly id!: string;
  readonly email!: string;
  readonly hashedPassword!: string;
  readonly nickname!: string;
  readonly studentIdNumber!: string;
  readonly realName!: string;
  readonly isAdmin!: boolean;
  readonly isBanned!: boolean;
  readonly section!: string;
}
