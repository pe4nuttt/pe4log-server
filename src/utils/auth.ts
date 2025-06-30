import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const SALT_ROUND = 11;
  const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

  return hashedPassword;
};
