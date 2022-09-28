/** Workaround for un-typed Notion API date prop. */
export type DateProp = {
  type: "date";
  date: {
    start: string;
    // end: string | null;
    // time_zone: TimeZoneRequest | null;
  } | null;
  id: string;
};

export default function datePropToDate({ date }: DateProp) {
  let _date;
  if (date) {
    _date = new Date(date.start);
  }
  return _date;
}
