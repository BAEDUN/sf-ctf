const PWD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function validatePassword(password: string) {
  return PWD_REGEX.test(password);
}
