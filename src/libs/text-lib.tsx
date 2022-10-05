const truncate = (input, width) => {
  return input?.length > width ? `${input.substring(0, width)} ...` : input;
}

export { truncate };