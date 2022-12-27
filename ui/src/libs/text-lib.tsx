const truncate = (input: string, width: number) => {
  return input?.length > width ? `${input.substring(0, width)} ...` : input;
}

export { truncate };