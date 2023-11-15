export class CreateUserDto {
  username: string;
  email: string;
  // Add other properties as needed
}

export class UpdateUserDto {
  username?: string;
  email?: string;
  // Add other properties as needed
}
