export default function response (data: any, message: string, code: number = 200) {
  return {
    data,
    message,
    code
  }
}