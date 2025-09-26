export function checkIsNone(value: any) {
  return (
    value === null || value === undefined || Number.isNaN(value) || value === ""
  );
}
