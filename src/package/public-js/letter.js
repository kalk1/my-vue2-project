
// \src\package\public-js\letter.js
// 处理首字母大小

export const handleFirstUpperCase = (str) => {
  return str.replace(/( |^)[a-z]/g, L => L.toUpperCase());
}
