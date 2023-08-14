export const getData = () => {
  const result = [];
  for (let index = 0; index < 10000; index++) {
    result.push(index);
  }
  return result;
};
