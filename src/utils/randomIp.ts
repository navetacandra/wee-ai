export default function randomIp(): string {
  return Array(4)
    .fill(0)
    .map((_) => Math.floor(Math.random() * 256))
    .join(".");
}
