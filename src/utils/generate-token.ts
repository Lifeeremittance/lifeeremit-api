export const generateToken = (
  length = 6,
  type: 'alpha' | 'numeric' | 'alphanumeric' = 'numeric',
) => {
  const chars = {
    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    numeric: '0123456789',
    alphanumeric:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  };

  let result = '';

  for (let i = length; i > 0; --i)
    result += chars[type][Math.floor(Math.random() * chars[type].length)];

  return result;
};
