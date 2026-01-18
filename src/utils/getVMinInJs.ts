export default function getVMinInJs() {
  return (
    Math.min(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight
    ) / 100
  );
}
