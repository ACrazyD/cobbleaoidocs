---
layout: page
title: KubeJS Cheat Sheet
---

# KubeJS Cheat Sheet

A quick-reference guide for common KubeJS addon recipe patterns used in this pack.

> KubeJS note: scripts are typically placed in `server_scripts/`, and you can reload them with `/reload` or `/kubejs reload server_scripts`.

## Navigation

- [KubeJS cheat-sheet](#kubejs-cheat-sheet)
  - [Common recipe patterns](#common-recipe-patterns)
  - [Batch recipes with arrays and loops](#batch-recipes-with-arrays-and-loops)
  - [Chance-based outputs](#chance-based-outputs)
  - [Fluid input/output patterns](#fluid-inputoutput-patterns)
  - [Matching recipe IDs and filtering logic](#matching-recipe-ids-and-filtering-logic)
  - [Helpful helper ideas](#helpful-helper-ideas)
  - [Core KubeJS recipe builders](#core-kubejs-recipe-builders)
  - [Custom JSON recipes and datapack-style recipes](#custom-json-recipes-and-datapack-style-recipes)
  - [Removing recipes](#removing-recipes)
  - [Replacing inputs and outputs](#replacing-inputs-and-outputs)
  - [Helper functions and loops](#helper-functions-and-loops)
  - [Custom item + texture path cheat-sheet](#custom-item--texture-path-cheat-sheet)
- [KubeJS tag script contexts](#kubejs-tag-script-contexts)
- [Botany Pots](#botany-pots)
- [TFMG](#tfmg-the-factory-must-grow)
- [Mystical Customization](#mystical-customization-datapack)
- [Replication](#replication)
- [Rechiseled](#rechiseled)
- [Create Automation](#create-automation)
- [Powah](#powah)
- [Occultism](#occultism)
- [OriTech](#oritech)
- [External references](#external-references)

---

## KubeJS cheat-sheet

[Back to top](#kubejs-addon-reference)

Use these patterns when you want to make lots of recipes quickly or build reusable recipe helpers.

### Common recipe patterns

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.recipes(e => {
    // single item output
    e.shaped('minecraft:stone', [
        'AAA',
        'AAA',
        'AAA'
    ], {
        A: 'minecraft:cobblestone'
    });

    // multiple outputs / array outputs
    e.shapeless(['minecraft:iron_ingot', 'minecraft:gold_ingot'], ['minecraft:iron_block', 'minecraft:gold_block']);

    // fluid + item input
    e.custom({
        type: 'minecraft:smelting',
        ingredient: { item: 'minecraft:iron_ore' },
        result: 'minecraft:iron_ingot',
        experience: 0.1,
        cookingtime: 200
    });

    // simple custom recipe id
    e.shapeless('minecraft:wet_sponge', ['minecraft:sponge', 'minecraft:water_bucket'])
        .id('kubejs:custom_wet_sponge');
});
```

### Batch recipes with arrays and loops

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.recipes(e => {
    const materials = ['minecraft:stone', 'minecraft:granite', 'minecraft:diorite', 'minecraft:andesite'];

    materials.forEach((block) => {
        e.shaped(Item.of('minecraft:polished_' + block.split(':')[1], 4), [
            'SS',
            'SS'
        ], {
            S: block
        }).id(`kubejs:${block.split(':')[1]}_to_polished`);
    });
});
```

### Chance-based outputs

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.recipes(e => {
    e.recipes.create.crushing(
        ['minecraft:diamond', Item.of('minecraft:emerald', 0.25)],
        'minecraft:coal_block'
    );
});
```

### Fluid input/output patterns

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.recipes(e => {
    // fluid as input
    e.custom({
        type: 'create:mixing',
        ingredients: [{ item: 'minecraft:iron_ore' }],
        results: [{ item: 'minecraft:iron_ingot' }],
        fluid: { fluid: 'minecraft:water', amount: 250 }
    });

    e.custom({
        type: 'minecraft:smelting',
        ingredient: { item: 'minecraft:iron_ore' },
        result: 'minecraft:iron_ingot',
        experience: 0.1,
        cookingtime: 200
    });
});
```

### Matching recipe IDs and filtering logic

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.recipes(e => {
    e.recipes.create.mixing('minecraft:diamond', 'minecraft:coal_block');

    // can be filtered by ID or custom logic
    const recipeId = 'kubejs:custom_recipe';
    e.recipes.create.compacting('minecraft:stone', 'minecraft:cobblestone').id(recipeId);
});
```

### Helpful helper ideas

[Back to top](#kubejs-addon-reference)

- Use arrays when a recipe can output multiple items.
- Use `Item.of(...).withChance(...)` for weighted drops or random outputs.
- Use `.id('modid:your_recipe')` to keep recipe names predictable.
- Use loops to generate large batches of similar recipe variants.
- Use `ServerEvents.recipes(e => { ... })` for recipe registration and custom logic blocks when you need to filter or override existing ones.

### Core KubeJS recipe builders

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.recipes(e => {
    // Shaped recipe
    e.shaped('3x minecraft:stone', [
        'A B',
        ' C ',
        'B A'
    ], {
        A: 'minecraft:andesite',
        B: 'minecraft:diorite',
        C: 'minecraft:granite'
    });

    // Shapeless recipe
    e.shapeless('3x minecraft:dandelion', [
        'minecraft:bone_meal',
        'minecraft:yellow_dye',
        '3x minecraft:ender_pearl'
    ]);

    // Smithing recipe
    e.smithing(
        'minecraft:netherite',
        'minecraft:iron_ingot',
        'minecraft:black_dye'
    );

    // Smelting / blasting / smoking / campfire cooking
    e.smelting('3x minecraft:gravel', 'minecraft:stone');
    e.blasting('10x minecraft:iron_nugget', 'minecraft:iron_ingot');
    e.smoking('minecraft:tinted_glass', 'minecraft:glass');
    e.campfireCooking('minecraft:torch', 'minecraft:stick');

    // Stonecutting
    e.stonecutting('3x minecraft:stick', '#minecraft:planks');
});
```

### Custom JSON recipes and datapack-style recipes

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.recipes(e => {
    // Example: Farmer's Delight cutting board style recipe
    e.custom({
        type: 'farmersdelight:cutting',
        ingredients: [{ item: 'minecraft:cake' }],
        tool: { tag: 'forge:tools/knives' },
        result: [{ item: 'farmersdelight:cake_slice', count: 7 }]
    });

    // Example: Tinkers' Construct alloy recipe
    e.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { tag: 'forge:molten_gold', amount: 90 },
            { tag: 'forge:molten_silver', amount: 90 }
        ],
        result: { fluid: 'tconstruct:molten_electrum', amount: 180 },
        temperature: 760
    });
});
```

> This is the same idea as datapack recipe creation: if a mod supports datapack recipes, you can add or override recipes without needing a dedicated addon.

### Removing recipes

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.recipes(e => {
    e.remove({});
    e.remove({ output: 'minecraft:stone_pickaxe' });
    e.remove({ output: '#minecraft:wool' });
    e.remove({ input: '#forge:dusts/redstone' });
    e.remove({ mod: 'farmersdelight' });
    e.remove({ type: 'minecraft:campfire_cooking' });
    e.remove({ output: 'minecraft:cooked_chicken', type: 'minecraft:campfire_cooking' });
    e.remove({ id: 'minecraft:glowstone' });
});
```

Useful filters:

- `output: 'minecraft:item'`
- `input: 'minecraft:item'`
- `mod: 'modid'`
- `id: 'recipe_id'`
- `type: 'minecraft:smelting'`
- `not: { ... }`
- arrays for OR matching: `[{...}, {...}]`

### Replacing inputs and outputs

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.recipes(e => {
    e.replaceInput(
        { input: 'minecraft:stick' },
        'minecraft:stick',
        '#minecraft:saplings'
    );

    e.replaceOutput(
        { output: 'minecraft:iron_ingot' },
        'minecraft:iron_ingot',
        'minecraft:gold_ingot'
    );
});
```

### Helper functions and loops

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.recipes(e => {
    const potting = (output, pottedInput) => {
        e.shaped(output, [
            'BIB',
            ' B '
        ], {
            B: 'minecraft:brick',
            I: pottedInput
        });
    };

    potting('kubejs:potted_snowball', 'minecraft:snowball');
    potting('kubejs:potted_lava', 'minecraft:lava_bucket');
    potting('minecraft:blast_furnace', 'minecraft:furnace');

    const blocks = ['minecraft:stone', 'minecraft:granite', 'minecraft:diorite'];
    blocks.forEach((block) => {
        e.shaped(Item.of('minecraft:polished_' + block.split(':')[1], 4), [
            'SS',
            'SS'
        ], { S: block });
    });
});
```

### Custom item + texture path cheat-sheet

[Back to top](#kubejs-addon-reference)

```js
StartupEvents.registry('item', e => {
    e.create('kubejs:test_ingot')
        .displayName('Test Ingot');

    e.create('kubejs:custom_pickaxe')
        .toolTier('diamond')
        .displayName('Custom Pickaxe');
});
```

Texture conventions for custom items:

- Item JSON model path: `kubejs/models/item/test_ingot.json`
- Item texture PNG path: `kubejs/textures/item/test_ingot.png`
- Parent item model often uses `item/generated`
- For non-generated 3D items, model JSON may point to a different parent or a custom block model

Example item model JSON:

```json
{
  "parent": "minecraft:item/generated",
  "textures": {
    "layer0": "kubejs:item/test_ingot"
  }
}
```

Quick rules:

- The item ID is usually the namespace/path stem: `kubejs:test_ingot` -> texture path `kubejs:item/test_ingot`
- Keep the namespace consistent with your modpack or KubeJS folder structure
- You can intentionally register items under other mod namespaces such as `minecraft:custom_thing`, `create:my_item`, or `botania:foo` if you want to intentionally "inject" or override naming/lookup behavior, but that is usually a specialized case and should be used carefully
- If the item is not showing a texture, check the JSON filename, texture filename, and resource pack path match exactly
- For data-driven packs, model and texture paths are usually under the resource pack or generated KubeJS resource folder, not under `config/`

Namespace / modname context:

```js
StartupEvents.registry('item', e => {
    // Default KubeJS namespace
    e.create('kubejs:test_ingot')
        .displayName('Test Ingot');

    // Injecting item IDs under another namespace is possible
    e.create('minecraft:custom_test_ingot')
        .displayName('Custom Test Ingot');

    // You can also use a custom mod namespace for your own pack content
    e.create('my_pack:custom_pickaxe')
        .toolTier('diamond')
        .displayName('Custom Pickaxe');
});
```

This is useful when you want a custom item to be recognized as if it belongs to a different mod namespace, but it is usually best to keep your own custom items under your own namespace unless you are intentionally overriding or bridging another mod’s identity.

---

## KubeJS tag script contexts

[Back to top](#kubejs-addon-reference)

Use these when you want to modify tags in script form instead of writing raw JSON. The general pattern is `ServerEvents.tags('type', e => { ... })`, where the type is the tag category such as `item`, `block`, `fluid`, `entity_type`, `biome`, and so on.

### Item tags

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.tags('item', e => {
    // Add entries to a tag
    e.add('forge:ingots/iron', 'minecraft:iron_ingot');
    e.add('forge:ingots/iron', ['minecraft:iron_block', 'create:iron_sheet']);

    // Add a tag to another tag
    e.add('forge:storage_blocks/iron', '#forge:storage_blocks');

    // Remove entries from a tag
    e.remove('forge:ingots/iron', 'minecraft:iron_nugget');

    // Add a namespace tag using a raw tag path
    e.add('c:ingots/iron', '#forge:ingots/iron');
});
```

### Block tags

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.tags('block', e => {
    e.add('minecraft:logs', [
        'minecraft:oak_log',
        'minecraft:spruce_log',
        '#minecraft:logs_that_burn'
    ]);

    e.add('forge:stone', ['minecraft:stone', 'minecraft:granite', 'minecraft:diorite']);
    e.remove('minecraft:flowers', 'minecraft:dead_bush');
});
```

### Fluid tags

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.tags('fluid', e => {
    e.add('forge:water', 'minecraft:water');
    e.add('forge:lava', 'minecraft:lava');
    e.remove('forge:water', 'minecraft:water_bucket');
});
```

### Entity tags and other tag types

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.tags('entity_type', e => {
    e.add('forge:bosses', 'minecraft:ender_dragon');
    e.add('forge:bosses', ['minecraft:wither', 'minecraft:warden']);
});

ServerEvents.tags('biome', e => {
    e.add('minecraft:is_overworld', 'minecraft:plains');
});
```

### Handy tag tips

[Back to top](#kubejs-addon-reference)

- The tag name usually starts with `forge:`, `c:`, or another mod namespace, and the values are item/block/fluid IDs or other tag IDs.
- Use `#tag_id` when you want to add a whole tag into another tag or reference a tag as an ingredient.
- `e.add(tag, value)` and `e.remove(tag, value)` are the normal ways to build or trim tag contents.
- For large tag edits, build arrays and loop through them to keep the script compact.
- Tags can be combined with KubeJS recipe scripts so one tag can satisfy multiple recipe inputs without repeating ID lists.

---

## Botany Pots

[Back to top](#kubejs-addon-reference)

Official KubeJS pattern for Botany Pots matches this structure:

```js
ServerEvents.recipes(e => {
    e.recipes.botanypots.crop(
        'minecraft:candle', // seed item
        ['minecraft:oak_leaves'], // categories this crop can be planted on
        { block: 'minecraft:candle' }, // display block
        [
            Item.of('minecraft:candle')
                .withChance(100) // relative weight
                .withRolls(1, 2) // min/max rolls
        ],
        10, // growthTicks
        1 // optional growthModifier, usually 1
    );

    e.recipes.botanypots.soil(
        'minecraft:oak_leaves', // item attached to the soil
        { block: 'minecraft:oak_leaves' }, // display block
        ['minecraft:oak_leaves'], // categories the soil provides
        100, // growth ticks provided, set to -1 for no modifier
        0.5 // optional growth modifier
    );

    e.recipes.botanypots.fertilizer(
        'minecraft:iron_ingot', // fertilizer item
        10, // min growth ticks
        20 // max growth ticks
    );
});

BotanyPotsEvents.onCropGrow(e => {
    // e.random
    // e.crop
    // e.originalDrops
    // e.drops
    console.log([e.random, e.crop, e.originalDrops, e.drops].join(','));
});
```

---

## TFMG (The Factory Must Grow)

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.recipes(e => {
    // Casting supports ONE input fluid, up to THREE item outputs.
    // The last argument (the "100" at the end) is processing time in ticks.
    // This recipe generates cobblestone from lava in the cast.
    e.recipes.tfmg.casting(Fluid.of("minecraft:lava", 1), ["minecraft:cobblestone"], 100);

    // Coking supports ONE input item.
    // NOTE: Second argument must be one item and one fluid. (TFMG thing)
    // The last argument (the "100" at the end) is processing time in ticks.
    // This recipe uses mud to create dirt and water.
    e.recipes.tfmg.coking("minecraft:mud", ["minecraft:dirt", Fluid.of("minecraft:water", 5)], 100);

    // Distillation supports ONE input item, and up to 6 output fluids.
    // This example uses 500 mB of water to create 400 mB of water and 100 mB of lava.
    e.recipes.tfmg.distillation(
        Fluid.of("minecraft:water", 500),
        [Fluid.of("minecraft:water", 400), Fluid.of("minecraft:lava", 100)]
    );

    // Industrial Blasting supports ONE input item, and up to TWO fluid outputs.
    // This example uses dirt to make 300mB of water and 200mB of lava.
    e.recipes.tfmg.industrial_blasting(
        "minecraft:dirt",
        [Fluid.of("minecraft:water", 300), Fluid.of("minecraft:lava", 200)],
        1
    );

    // Polarizing supports ONE input item, and ONE output item.
    // NOTE: Third argument is the amount of FE (energy) the recipe needs/uses.
    // This example makes one mud from dirt with 400 FE.
    e.recipes.tfmg.polarizing("minecraft:dirt", "minecraft:mud", 400);
});
```

---

## Mystical Customization (Datapack)

[Back to top](#kubejs-addon-reference)

This is not a KubeJS addon. Mystical Customization crops are added through datapack JSON files in `config/mysticalcustomization/crops/`.

The file name becomes the crop ID, and it must be lowercase with underscores instead of spaces.

### Basic crop example

```json
{
  "name": "Test",
  "type": "resource",
  "tier": "mysticalagriculture:1",
  "ingredient": {
    "item": "minecraft:iron_ingot"
  },
  "color": "eb7a34",
  "models": {
    "flower": "mysticalagriculture:block/flower_dust",
    "essence": "mysticalagriculture:item/essence_dust"
  },
  "crux": "minecraft:cobblestone"
}
```

### Common fields

- `name`: display name for the crop
- `type`: required crop type ID
- `tier`: required crop tier ID
- `ingredient`: item or tag used for the seed recipe
- `color` or `colors`: crop/essence/seed color theme
- `models`: optional flower, essence, or seed model override
- `crux`: block required beneath farmland
- `biomes`: optional allowed biome list
- `base_secondary_chance`: optional secondary drop chance
- `recipes`: optional settings to disable generated crafting/infusion/reprocessor recipes

### Example with tag ingredient and biome restriction

```json
{
  "name": "Iron Bloom",
  "type": "mysticalagriculture:resource",
  "tier": "mysticalagriculture:1",
  "ingredient": {
    "tag": "c:ingots/iron"
  },
  "color": "aaaaaa",
  "biomes": [
    "minecraft:plains",
    "minecraft:desert"
  ],
  "base_secondary_chance": 0.4,
  "crux": "minecraft:stone"
}
```

Official docs: [MysticalCustomization Adding Crops](https://blakesmods.com/docs/mysticalcustomization/adding-crops)

---

## Replication

[Back to top](#kubejs-addon-reference)

This is for the Replication mod. You can register custom matter types and assign matter values to items or tags.

### Creating custom matter types

```js
// kubejs/startup_scripts/replication_matter_types.js
StartupEvents.registry('replication:matter_types', e => {
    // Basic type
    e.create('plasma')
        .color(0.2, 0.7, 1.0, 1.0); // RGBA 0..1

    // Another example
    e.create('crystal')
        .color(0.6, 0.9, 0.9, 1.0);
});
```

### Adding matter values for items and tags

Use `ServerEvents.recipes` and the global `Replication` helper to build the recipe JSON for the custom recipe type `replication:matter_value`.

```js
// kubejs/server_scripts/replication_matter_values.js
ServerEvents.recipes(e => {
    // Single item
    e.custom(Replication.matterValueForItem('minecraft:stone', {
        earth: 3.0,
    }));

    // Tag (with or without leading #)
    e.custom(Replication.matterValueForTag('#c:iron_ingots', {
        metallic: 4,
    }));

    // Arbitrary ingredient object
    e.custom(Replication.matterValue({ tag: 'minecraft:planks' }, {
        "kubejs:plasma": 2,
    }));
});
```

### For pack makers

#### Datapack

You can modify, add, or remove matter values using datapacks. You do not need to add values for every modded item because the system can calculate them using crafting recipes.

#### Blueprints

You can create blueprints (one-use items) that preserve a percentage of the scanned item information using:

```text
/replication create-blueprint-using-hand <progress>
```

Where `progress` is a decimal number between `0` and `1`. This lets you create a blueprint using the current item in your hand while respecting the item NBT. Those blueprints can then be transferred using the Identification Chamber or directly to the Chip Storage.

#### Tags

You can disable items from being scanned using:

- `replication:cant_be_scanned`
- `replication:cant_be_disintegrated`
- `replication:skip_calculation`
- `replication:ignore_crafting_result`

These tags prevent scan, disintegration, calculation, or crafting-result subtraction behavior respectively.

---

## Rechiseled

[Back to top](#kubejs-addon-reference)

Instead of generating datapack files or manually overriding JSON resources, chiseling sets can be managed directly from readable JavaScript files inside your kubejs/server_scripts folder.

### Usage

Register and modify chiseling sets with the `RechiseledEvents.chiseling` event:

```js
RechiseledEvents.chiseling(e => {
    // Chiseling sets go here
});
```

### Adding a chiseling set

Use `e.add()` to register a new chiseling set.

```js
RechiseledEvents.chiseling(e => {
    e.add('andesite_set', [
        'minecraft:andesite',
        'minecraft:polished_andesite',
        '#minecraft:stone_tool_materials'
    ]);
});
```

- The first argument is the identifier for the new chiseling set.
- The second argument is an array containing the blocks or tags that should be included in the set.
- Both individual block IDs and block tags are supported.

### Overwriting a chiseling set

Use `e.overwrite()` to replace the contents of an existing chiseling set.

```js
RechiseledEvents.chiseling(e => {
    e.overwrite('custom_stone_set', [
        'minecraft:stone',
        'minecraft:smooth_stone'
    ]);
});
```

This replaces the existing entries in the specified chiseling set with the entries supplied by the script.

### Complete example

```js
RechiseledEvents.chiseling(e => {
    e.add('andesite_set', [
        'minecraft:andesite',
        'minecraft:polished_andesite',
        '#minecraft:stone_tool_materials'
    ]);

    e.overwrite('custom_stone_set', [
        'minecraft:stone',
        'minecraft:smooth_stone'
    ]);
});
```

### Dynamic set generation

Because chiseling sets are defined through JavaScript, larger collections can be generated using arrays and loops.

```js
const colors = [
    'red',
    'blue',
    'green',
    'yellow'
];

RechiseledEvents.chiseling(e => {
    const entries = [
        'examplemod:metal_panel'
    ];

    colors.forEach(color => {
        entries.push(`examplemod:${color}_metal_panel`);
    });

    e.add('colored_metal_panels', entries);
});
```

---

## Create Automation

[Back to top](#kubejs-addon-reference)

The official Create addon docs describe these common server recipe patterns:

```js
ServerEvents.recipes(e => {
    // Compacting: Mechanical Press + Basin
    e.recipes.create.compacting('minecraft:diamond', 'minecraft:coal_block');
    e.recipes.create.compacting('minecraft:diamond', 'minecraft:coal_block').heated();

    // Crushing: Crushing Wheels
    e.recipes.create.crushing('minecraft:diamond', 'minecraft:coal_block');
    e.recipes.create.crushing(
        ['minecraft:diamond', CreateItem.of('minecraft:diamond', 0.5)],
        'minecraft:coal_block'
    );

    // Cutting: Mechanical Saw
    e.recipes.create.cutting('minecraft:diamond', 'minecraft:coal_block');
    e.recipes.create.cutting('minecraft:diamond', 'minecraft:coal_block').processingTime(500);

    // Deploying: Deployer
    e.recipes.create.deploying('minecraft:diamond', ['minecraft:coal_block', 'minecraft:sand']);

    // Emptying / Filling
    e.recipes.create.emptying([Fluid.of('minecraft:water'), 'minecraft:bucket'], 'minecraft:water_bucket');
    e.recipes.create.filling('minecraft:water_bucket', [Fluid.of('minecraft:water'), 'minecraft:bucket']);

    // Mixing
    e.recipes.create.mixing('minecraft:diamond', 'minecraft:coal_block');
    e.recipes.create.mixing('minecraft:diamond', 'minecraft:coal_block').heated();

    // Sequenced assembly
    e.recipes.create.sequenced_assembly(
        [CreateItem.of('create:precision_mechanism', 0.13)],
        'create:golden_sheet',
        [
            e.recipes.create.deploying('create:incomplete_precision_mechanism', ['create:incomplete_precision_mechanism', 'create:cogwheel']),
            e.recipes.create.deploying('create:incomplete_precision_mechanism', ['create:incomplete_precision_mechanism', 'minecraft:iron_nugget'])
        ]
    )
        .transitionalItem('create:incomplete_precision_mechanism')
        .loops(5);
});
```

You can also still use custom automation hooks like the examples below when you need more logic-based filtering or item modification:

```js
KJSCAutoEvents.deployerUse(e => {
    var {block, outputs, heldItem} = e;
    if (heldItem != "create:sand_paper") return;
    if (!block.offset(0, -3, 0).blockState.is(Blocks.DIAMOND_BLOCK)) return;
    e.setDamage(0);
    while (outputs.length > 0) outputs.remove(0);
    outputs.add(0, Item.of("diamond"));
});

KJSCAutoEvents.blockDestroy(e => {
    var {block, level, targetPos, targetBlock} = e;
    if (targetBlock.getId() != "minecraft:clay") return;
    block.popItem(Item.of("diamond_axe"));
    level.destroyBlock(targetPos, false);
    e.cancel();
});
```

---

## Powah

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.recipes(e => {
    // .energizing([inputs, ...], output, energy)
    e.recipes.powah.energizing(["minecraft:cobblestone"], "minecraft:tnt", 1000);
});

PowahEvents.registerCoolants(e => {
    // .addFluid(fluid, temperature)
    e.addFluid("minecraft:lava", -10);

    // item count here is not count consumed, but rather mb of coolant produced by 1 item
    // .addSolid(solid, temperature)
    e.addSolid(Item.of("minecraft:cobblestone", 1), -10);

    // .removeFluid(fluid)
    // .removeSolid(solid)
});

PowahEvents.registerHeatSource(e => {
    // .addBlock(block, temperature)
    e.addBlock("minecraft:cobblestone", 10);

    // .addFluid(fluid, temperature)
    e.addFluid("minecraft:water", 10);

    // .removeFluid(fluid)
    e.removeFluid("minecraft:lava");
});

PowahEvents.registerMagmaticFluid(e => {
    // .add(fluid, temperature)
    e.add("minecraft:water", 10);

    // .remove(fluid)
});

PowahEvents.registerReactorFuel(e => {
    // item count here is not count consumed, but rather mb of fuel produced by 1 item
    // .add(fuel, temperature)
    e.add(Item.of("minecraft:cobblestone", 100), 700);

    // .remove(fuel)
});
```

---

## Occultism

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.recipes((e) => {
    e.recipes.occultism.spirit_trade('minecraft:rotten_flesh', 'minecraft:bone');
    e.recipes.occultism.spirit_fire('minecraft:emerald_ore', '#forge:gems/emerald');
    e.recipes.occultism.crushing(
        '2x #forge:ores/iron',
        '#forge:tools/swords'
    );
    e.recipes.occultism.miner(
        Item.of('minecraft:wooden_pickaxe').withChance(100),
        '#occultism:miners/master'
    );
    e.recipes.occultism.ritual(
        'occultism:spirit_lantern',
        [
            "lapis_lazuli",
            "#forge:raw_materials",
            ["minecraft:coal", 'minecraft:charcoal'],
        ],
        '#forge:stone',
        'occultism:craft_afrit'
    ).dummy("kubejs:dummy_ritual_thing").useItem('minecraft:egg');
});
```

---

## OriTech

[Back to top](#kubejs-addon-reference)

```js
ServerEvents.recipes(e => {
    e.recipes.oritech.pulverizer(
        'minecraft:sponge',    // Item Output
        'minecraft:coal_block'    // Item Input
    ).time(100);  // ticks

    e.recipes.oritech.grinder(
        'minecraft:sponge',    // Item Output
        'minecraft:iron_block'    // Item Input
    ).time(80);  // ticks

    e.recipes.oritech.assembler(
        'minecraft:sponge',    // Item Output
        ['minecraft:iron_ingot', 'minecraft:iron_ingot', 'minecraft:iron_ingot']    // Item Input
    ).time(120);  // ticks

    e.recipes.oritech.centrifuge(
        ['minecraft:sponge', 'minecraft:sponge'],     // Item Outputs
        'minecraft:gravel'    // Item Input
    ).time(60);  // ticks

    e.recipes.oritech.foundry(
        'minecraft:sponge',     // Item Output
        ['minecraft:gold_ingot', 'minecraft:diamond']    // Item Input
    ).time(200);  // ticks

    e.recipes.oritech.laser(
        'minecraft:sand'    // Item Input
    ).time(40);  // ticks

    e.recipes.oritech.atomic_forge(
        'minecraft:sponge',     // Item Output
        ['minecraft:diamond', 'minecraft:emerald', 'minecraft:gold_block']    // Item Input
    ).time(300);  // ticks

    e.recipes.oritech.particle_collision(
        'minecraft:sponge',     // Item Output
        ['minecraft:ender_pearl', 'minecraft:blaze_powder']    // Item Input
    ).time(400); // For this specific recipe type, "time" represents minimum collision.

    e.recipes.oritech.refinery(
        [],      // Item Output - But since Refinery cannot output any items, it should remain empty.
        [FluidOutput.of('minecraft:water', 500), FluidOutput.of('minecraft:lava', 250)],    // Fluid Output
        ['minecraft:coal', 'minecraft:redstone'],    // Item Input
        FluidInput.of('oritech:still_naphtha', 1000)    // Fluid Input
    ).time(120);  // ticks

    e.recipes.oritech.cooler(
        'minecraft:sponge',    // Item Output
        [],     // Fluid Output, but it should remain empty because this machine doesn't have a fluid output.
        [],     // Item Input, but it should remain empty because this machine doesn't have a item input.
        FluidInput.of('minecraft:lava', 1000)     // Fluid Input
    ).time(60);  // ticks

    e.recipes.oritech.centrifuge_fluid(
        'minecraft:sponge',    // Item Output
        [FluidOutput.of('minecraft:water', 200)],    // Fluid Output
        'minecraft:sugar',    // Item Input
        FluidInput.of('minecraft:water', 500)    // Fluid Input
    ).time(80);  // ticks
});
```

---

## External references

- [KubeJS](https://kubejs.com/)
- [Create Addon](https://kubejs.com/wiki/addons/create)
- [Botany Pots Addon](https://kubejs.com/wiki/addons/botany-pots)
- [KubeJS Wiki](https://kubejs.com/wiki)

[Back to top](#kubejs-addon-reference)
