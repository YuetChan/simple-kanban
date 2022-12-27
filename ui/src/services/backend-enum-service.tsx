const stringToEnum = (str: string) => {
  return str.replace(/([A-Z])/g, '_$1').trim().toUpperCase()
}

export { stringToEnum }