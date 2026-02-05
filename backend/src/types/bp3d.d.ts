declare module 'bp3d' {
    export class Item {
        constructor(name: string, width: number, height: number, depth: number, weight: number);
        name: string;
        width: number;
        height: number;
        depth: number;
        weight: number;
        position: [number, number, number];
    }

    export class Bin {
        constructor(name: string, width: number, height: number, depth: number, maxWeight: number);
        name: string;
        width: number;
        height: number;
        depth: number;
        maxWeight: number;
        items: Item[];
    }

    export class Packer {
        constructor();
        addBin(bin: Bin): void;
        addItem(item: Item): void;
        pack(): void;
        bins: Bin[];
    }
}
