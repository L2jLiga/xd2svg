export default (str): string => str
  .replace(/(^[A-Z])/, ([first]) => first.toLowerCase())
  .replace(/([A-Z])/g, ([letter]) => `-${letter.toLowerCase()}`);
