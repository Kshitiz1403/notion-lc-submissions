const sleep = async (duration) => {
  return new Promise((res, rej) => {
    return setTimeout(() => {
      return res();
    }, duration);
  });
};


module.exports = {sleep}