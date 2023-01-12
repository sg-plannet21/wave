export function mapMessageToModel(message: string | null): number | null {
  return message ? parseInt(message) : null;
}
