export default interface Step {
  prompt: string;
  final?: boolean;
  variable?: string;
  options: {
    id: string;
    name: string;
    next: string;
  }[];
}
