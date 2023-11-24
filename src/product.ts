export class Product {
  constructor(
    public serial: string,
    public condition: 'perfect' | 'damaged',
    public name: string,
  ) {}
}
