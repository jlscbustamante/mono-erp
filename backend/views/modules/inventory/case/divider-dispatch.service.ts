export class DividerDispatchService {
  private readonly pathJson: string;
  constructor() {
    this.pathJson = Deno.cwd() + "/files/relation-divider.json";
  }

  async readRelation() {
    const text = await Deno.readTextFile(this.pathJson);
    return JSON.parse(text);
  }

  async writeRelation(data: Record<string, string>) {
    await Deno.writeTextFile(this.pathJson, JSON.stringify({ data }));
  }
}
