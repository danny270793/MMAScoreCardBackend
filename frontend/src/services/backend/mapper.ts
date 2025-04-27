import { Device, Event, Fighter, Record, Streak } from './models'

export const mapper = {
  toEvent: (item: Event): Event => ({
    ...item,
    date: item.date === null ? null : new Date(item.date),
  }),
  toFighter: (item: Fighter): Fighter => ({
    ...item,
    birthday: new Date(item.birthday),
    died: item.died !== null ? new Date(item.died) : null,
  }),
  toStreak: (item: Streak): Streak => ({
    ...item,
    from: new Date(item.from),
    to: new Date(item.to),
  }),
  toRecord: (item: Record): Record => ({
    ...item,
  }),
  toDevice: (item: Device): Device => ({
    ...item,
    current: item.current === true ? true : false,
    last_used_at: item.last_used_at ? new Date(item.last_used_at) : null,
  }),
}
