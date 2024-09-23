interface ConflictNode {
  node: NodeItem;
  childsId: [number, number];
}

export class NodeItem {
  id: number;
  childs: NodeItem[] = [];
  conflictIndex = 0;
  constructor(id: number, childs: NodeItem[] = []) {
    this.id = id;
    this.childs = childs;
  }
  getConflict(): ConflictNode | undefined {
    if (this.conflictIndex > this.childs.length - 2) {
      this.conflictIndex = 0;
    }
    const { childs, conflictIndex } = this;
    if (childs.length == 0) return undefined;
    if (childs.length == 1) return childs[0].getConflict();
    const res = {
      node: this,
      childsId: [childs[0 + conflictIndex].id, childs[1 + conflictIndex].id],
    } as ConflictNode;
    this.conflictIndex += 1;
    return res;
  }
  solveConflict(bestId: number, worstId: number) {
    const { childs } = this;
    const best = childs.find((child) => child.id == bestId)!;
    const worst = childs.find((child) => child.id == worstId)!;
    this.childs = childs.filter((child) => child.id != worstId);
    best.childs.push(worst);
  }

  toString(): string {
    const childs =
      this.childs.length == 0
        ? ""
        : "(" + this.childs.map((child) => child.toString()).join(", ") + ")";
    const text = `${this.id}${childs}`;
    return text;
  }
  getChildList(): number[] {
    if (this.childs.length == 0) return [];
    return [this.childs[0].id, ...this.childs[0].getChildList()];
  }
  getDepth(): number {
    if (this.childs.length == 0) return 0;
    if (this.childs.length > 1) return 0;
    return 1 + this.childs[0].getDepth();
  }
}
