export const createSussessResponse = (data: any) => {
  return {
    code: 200,
    data,
    message: 'success',
  }
}

export const createErrorResponse = (code: number, message: string) => {
  return {
    code,
    message,
  }
}
