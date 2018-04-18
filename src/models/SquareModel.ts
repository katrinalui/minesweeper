export default class Square {
  explosive: boolean = false;
  revealed: boolean = false;
  flagged: boolean = false;

  constructor(public pos: number[]) {}
}
