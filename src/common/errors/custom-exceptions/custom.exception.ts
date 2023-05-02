export abstract class CustomException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly name: string,
    public readonly status: number,
  ) {
    super(message);
  }
}
