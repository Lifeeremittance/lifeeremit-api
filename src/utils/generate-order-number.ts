export const generateOrderNumber = () => {
  // generate order number containing 12 numbers with hyphens in between every 4 digits
  const arr = Array(3)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10000))
    .join("-");
  return arr.toString();
};
