export function checkIsNone(value: any) {
  return (
    value === null || value === undefined || Number.isNaN(value) || value === ""
  );
}
export function scaleNumber(
  val: number,
  minVal: number,
  maxVal: number,
  scaleStart: number,
  scaleEnd: number
) {
  return (
    scaleStart + ((val - minVal) / (maxVal - minVal)) * (scaleEnd - scaleStart)
  );
}
