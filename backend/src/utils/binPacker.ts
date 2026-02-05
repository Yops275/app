import { Item, Bin, Packer } from 'bp3d';

export interface PackingItem {
    name: string;
    width: number;
    height: number;
    depth: number;
    weight: number;
}

export interface PackingResult {
    binName: string;
    metrics: {
        width: number;
        height: number;
        depth: number;
        packedWeight: number;
        volumetricEfficiency: number;
    };
    packedItems: {
        name: string;
        width: number;
        height: number;
        depth: number;
        weight: number;
        x: number;
        y: number;
        z: number;
    }[];
}

export const packItems = (boxCandidates: any[], itemsToPack: PackingItem[]): PackingResult | null => {
    const packer = new Packer();

    // 1. Add all available boxes to the packer
    boxCandidates.forEach(box => {
        // Dimensions in DB are usually Length(x), Width(y), Height(z)
        // bp3d uses Width, Height, Depth. Mapping: Length->Width, Width->Height, Height->Depth
        packer.addBin(new Bin(box.name, box.dimensions.length, box.dimensions.width, box.dimensions.height, 10000)); // Assuming max weight 10000 for now
    });

    // 2. Add items to the packer
    itemsToPack.forEach(item => {
        packer.addItem(new Item(item.name, item.width, item.height, item.depth, item.weight));
    });

    // 3. Pack
    packer.pack();

    // 4. Find the best bin (one that fits all items)
    // bp3d tries to pack items into bins. We check which bin has items.
    // However, bp3d packs into *one of* the bins if likely, or multiple. 
    // We want to find the *single smallest bin* that fits *everything*.
    // Standard `pack()` might distribute items. We need a strategy:
    // Try packing into each bin individually and pick the best one.

    // Optimized approach:
    // We should create a new Packer for EACH bin candidate to check if IT ALONE can hold all items.

    let bestBin: PackingResult | null = null;
    let minVolume = Infinity;

    for (const box of boxCandidates) {
        const singleBinPacker = new Packer();
        const bin = new Bin(box.name, box.dimensions.length, box.dimensions.width, box.dimensions.height, 10000);
        singleBinPacker.addBin(bin);

        itemsToPack.forEach(item => {
            singleBinPacker.addItem(new Item(item.name, item.width, item.height, item.depth, item.weight));
        });

        singleBinPacker.pack();

        // Check if all items fit into this ONE bin
        // bin.items contains the packed items.
        // If bin.items.length === itemsToPack.length, it's a valid fit.
        // Note: We also need to handle quantities if itemsToPack is expanded (which it is passed as unique items here).

        if (bin.items.length === itemsToPack.length) {
            const vol = box.dimensions.length * box.dimensions.width * box.dimensions.height;
            if (vol < minVolume) {
                minVolume = vol;

                // Format result
                bestBin = {
                    binName: box.name,
                    metrics: {
                        width: bin.width,
                        height: bin.height,
                        depth: bin.depth,
                        packedWeight: bin.items.reduce((sum: number, i: any) => sum + i.weight, 0),
                        volumetricEfficiency: (bin.items.reduce((sum: number, i: any) => sum + (i.width * i.height * i.depth), 0) / vol) * 100
                    },
                    packedItems: bin.items.map((i: any) => ({
                        name: i.name,
                        width: i.width,
                        height: i.height,
                        depth: i.depth,
                        weight: i.weight,
                        x: i.position[0], // x, y, z are set after packing
                        y: i.position[1],
                        z: i.position[2]
                    }))
                };
            }
        }
    }

    return bestBin;
};
