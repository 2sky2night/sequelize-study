import dayjs from 'dayjs';

export function getNowDateString (): string;
export function getNowDateString (time: Date): string;
export function getNowDateString (time?: Date) {
  const date = dayjs(time)
  return date.format('YYYY-MM-DD HH:mm:ss')
}