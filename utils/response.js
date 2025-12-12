export const success = (msg, data = null, code = 1) => {
  const res = { code, msg };
  if (data !== null) res.data = data;
  return res;
};

export const error = (msg, code = -1) => {
  return { code, msg };
};
