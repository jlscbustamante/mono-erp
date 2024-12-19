export const separateNames = (
  allNames: string,
): {
  firstName: string
  lastName: string
} => {
  const names = allNames.split(' ')
  if (names.length == 1) {
    return {
      firstName: names[0],
      lastName: '',
    }
  }
  if (names.length % 2 == 0) {
    return {
      firstName: names.slice(0, names.length / 2).join(' '),
      lastName: names.slice(names.length / 2).join(' '),
    }
  } else {
    return {
      firstName: names[0],
      lastName: names.slice(1).join(' '),
    }
  }
}
