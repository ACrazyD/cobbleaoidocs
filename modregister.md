---
layout: page
title: Mod Register
---

# Mod Register

A ProbeJS-friendly reference for mod IDs, KubeJS registration modes, addon recipe APIs, fluids, gases, and pack-specific resources.

Use the exact IDs reported by ProbeJS for this instance. Keep this file as the readable index and place large raw dumps in separate files when they become unwieldy.

## Navigation

- [Quick workflow](#quick-workflow)
- [KubeJS modes](#kubejs-modes)
  - [Startup scripts](#startup-scripts)
  - [Server scripts](#server-scripts)
  - [Client scripts](#client-scripts)
  - [Datapack systems](#datapack-systems)
- [Registry categories](#registry-categories)
  - [Items](#items)
  - [Blocks](#blocks)
  - [Fluids](#fluids)
  - [Gases](#gases)
  - [Entities](#entities)
  - [Tags](#tags)
- [Mod add-ons](#mod-add-ons)
  - [Botany Pots](#botany-pots)
  - [Create and Create Automation](#create-and-create-automation)
  - [TFMG](#tfmg-the-factory-must-grow)
  - [Powah](#powah)
  - [Occultism](#occultism)
  - [OriTech](#oritech)
  - [Rechiseled](#rechiseled)
  - [Replication](#replication)
- [Custom KubeJS content](#custom-kubejs-content)
  - [Custom items](#custom-items)
  - [Custom blocks](#custom-blocks)
  - [Textures and models](#textures-and-models)
- [ProbeJS dump layout](#probejs-dump-layout)
- [External references](#external-references)

---

## Quick workflow

[Back to top](#mod-register)

1. Use ProbeJS in the same client instance and Minecraft version as the pack.
2. Copy exact item, block, fluid, gas, tag, and recipe-type IDs into the matching category below.
3. Confirm whether the script belongs in `startup_scripts/`, `server_scripts/`, `client_scripts/`, or a datapack folder.
4. Test with `/reload` where supported. Restart the client for startup registry changes.
5. Record the working script and the ProbeJS lookup path beside the ID.

Recommended entry format:

```md
- `modid:thing`
  - Type: item | block | fluid | gas | entity | tag
  - Used by: recipe, tag, custom item, machine, or script
  - Notes: stack size, amount, temperature, tier, or other local detail
```

## KubeJS modes

[Back to top](#mod-register)

### Startup scripts

[Back to top](#mod-register)

Use startup scripts for registries and content that must exist before recipes or server data load.

Path: `kubejs/startup_scripts/`

```js
StartupEvents.registry('item', e => {
    e.create('example_item')
        .displayName('Example Item')
        .texture('kubejs:item/example_item');
});

StartupEvents.registry('block', e => {
    e.create('example_block')
        .displayName('Example Block')
        .material('stone');
});
```

Common registry types include `item`, `block`, `fluid`, `mob_effect`, `enchantment`, and addon-defined registries. ProbeJS can expose the exact registry type and available builder methods.

### Server scripts

[Back to top](#mod-register)

Use server scripts for recipes, tags, loot, world logic, and server-side events.

Path: `kubejs/server_scripts/`

```js
ServerEvents.recipes(e => {
    e.shapeless('kubejs:example_item', ['minecraft:iron_ingot']);
});

ServerEvents.tags('item', e => {
    e.add('forge:ingots/example', 'kubejs:example_item');
});
```

### Client scripts

[Back to top](#mod-register)

Use client scripts for tooltips, client-only events, keybinds, HUD changes, and visual behavior.

Path: `kubejs/client_scripts/`

```js
ItemEvents.tooltip(e => {
    e.add('kubejs:example_item', 'Pack reference item');
});
```

### Datapack systems

[Back to top](#mod-register)

Some mods load JSON data directly instead of exposing a KubeJS builder. Keep those entries separate from JavaScript APIs.

Typical locations:

- `kubejs/data/<namespace>/recipes/`
- `kubejs/data/<namespace>/tags/`
- `kubejs/data/<namespace>/loot_tables/`
- Mod-specific config or datapack folders, such as Mystical Customization crop JSON

Record the format, required fields, and reload behavior beside each datapack system.

## Registry categories

[Back to top](#mod-register)

### Items

[Back to top](#mod-register)

ProbeJS item IDs belong here. Include custom KubeJS items and useful tags.

```js
const itemId = 'minecraft:iron_ingot';
const itemStack = Item.of('minecraft:iron_ingot', 4);
const itemTag = '#forge:ingots/iron';
```

- Live ProbeJS item registry: [modregister-items.md](modregister-items.html).
- Note item tags separately when an item is commonly used through tags.

### Blocks

[Back to top](#mod-register)

```js
const blockId = 'minecraft:iron_block';
const blockTag = '#minecraft:mineable/pickaxe';
```

Record block IDs, block tags, harvest requirements, and any machine or contraption behavior. The live registry dump is [modregister-blocks.md](modregister-blocks.html).

### Fluids

[Back to top](#mod-register)

Fluids are liquid resources and should not be mixed with gas entries. Record the fluid ID, display name, amount convention, temperature, and common tags.

```js
ServerEvents.recipes(e => {
    e.custom({
        type: 'create:mixing',
        ingredients: [{ item: 'minecraft:iron_ore' }],
        results: [{ item: 'minecraft:iron_ingot' }],
        fluid: { fluid: 'minecraft:water', amount: 250 }
    });

    e.recipes.tfmg.casting(
        Fluid.of('minecraft:lava', 1000),
        ['minecraft:cobblestone'],
        100
    );
});
```

The complete live fluid registry is [modregister-fluids.md](modregister-fluids.html).

Suggested fluid entry format:

```md
- `modid:fluid`
  - Type: fluid
  - Amount: 1000 mB = 1 bucket, unless the mod says otherwise
  - Temperature: ProbeJS or mod documentation value
  - Tags: `#forge:...`
  - Notes: machine compatibility and source
```

### Gases

[Back to top](#mod-register)

Gases are stored separately because gas APIs, tanks, tags, and units vary by mod. Do not assume a gas can be passed to `Fluid.of()`.

```js
// Replace the recipe type and field names with the exact API reported by ProbeJS.
ServerEvents.recipes(e => {
    e.custom({
        type: 'modid:gas_recipe',
        gas_input: { gas: 'modid:example_gas', amount: 100 },
        result: { item: 'kubejs:example_item' }
    });
});
```

The gas-tag results are recorded in [modregister-gases.md](modregister-gases.html).

Suggested gas entry format:

```md
- `modid:gas`
  - Type: gas
  - Amount unit: mB, units, or mod-specific value
  - Container: tank, gas pipe, machine, or other handler
  - Tags: `#modid:...`
  - Notes: recipe types and conversion rules
```

### Entities

[Back to top](#mod-register)

Record entity IDs, spawn eggs, entity tags, and events that reference them.

```js
ServerEvents.tags('entity_type', e => {
    e.add('minecraft:hostile', 'modid:example_entity');
});
```

### Tags

[Back to top](#mod-register)

```js
ServerEvents.tags('item', e => {
    e.add('forge:ingots/example', 'kubejs:example_item');
    e.add('forge:ingots/example', '#forge:ingots/iron');
});

ServerEvents.tags('block', e => {
    e.add('minecraft:mineable/pickaxe', 'kubejs:example_block');
});

ServerEvents.tags('fluid', e => {
    e.add('forge:water', 'minecraft:water');
});
```

Supported contexts commonly include `item`, `block`, `fluid`, `entity_type`, and `biome`. Verify the exact context with the installed KubeJS version.

## Mod add-ons

[Back to top](#mod-register)

Each addon gets its own submenu so recipe APIs remain grouped by the mod that owns them.

### Botany Pots

[Back to top](#mod-register)

```js
ServerEvents.recipes(e => {
    e.recipes.botanypots.crop(
        'minecraft:candle',
        '#minecraft:leaves',
        DisplayState.basic('minecraft:candle'),
        [DropItem.item('minecraft:candle', 1.0)],
        100,
        0.1
    );

    e.recipes.botanypots.soil(
        'minecraft:oak_leaves',
        DisplayState.basic('minecraft:oak_leaves'),
        0.5,
        0.0
    );

    e.recipes.botanypots.fertilizer(
        'minecraft:iron_ingot',
        GrowthAmount.range(10, 20)
    );
});
```

ProbeJS is especially useful here for `DisplayState`, `DropItem`, and `GrowthAmount` signatures.

### Create and Create Automation

[Back to top](#mod-register)

Create recipes use `e.recipes.create.<type>`. Create Automation hooks use its event namespaces.

```js
ServerEvents.recipes(e => {
    e.recipes.create.crushing(
        ['minecraft:diamond', Item.of('minecraft:emerald').withChance(0.25)],
        'minecraft:coal_block'
    );
});

KJSCAutoEvents.deployerUse(e => {
    const { heldItem, outputs } = e;
    if (heldItem != 'create:sandpaper') return;

    while (outputs.length > 0) outputs.remove(0);
    outputs.add(0, Item.of('minecraft:diamond'));
});
```

Keep contraption events separate from stationary machine events when recording examples.

### TFMG (The Factory Must Grow)

[Back to top](#mod-register)

```js
ServerEvents.recipes(e => {
    e.recipes.tfmg.casting(
        Fluid.of('minecraft:lava', 1),
        ['minecraft:cobblestone'],
        100
    );

    e.recipes.tfmg.coking(
        'minecraft:mud',
        ['minecraft:dirt', Fluid.of('minecraft:water', 5)],
        100
    );

    e.recipes.tfmg.polarizing(
        'minecraft:dirt',
        'minecraft:mud',
        400
    );
});
```

Record item inputs, fluid inputs, output limits, energy arguments, and processing time from ProbeJS.

### Powah

[Back to top](#mod-register)

```js
ServerEvents.recipes(e => {
    e.recipes.powah.energizing(
        ['minecraft:cobblestone'],
        'minecraft:tnt',
        1000
    );
});

PowahEvents.registerCoolants(e => {
    e.addFluid('minecraft:lava', -10);
    e.addSolid(Item.of('minecraft:cobblestone', 1), -10);
});

PowahEvents.registerHeatSource(e => {
    e.addBlock('minecraft:cobblestone', 10);
    e.addFluid('minecraft:water', 10);
});
```

Keep Powah coolant, heat source, magmatic fluid, and reactor fuel registrations as separate subsections when the dump grows.

### Occultism

[Back to top](#mod-register)

```js
ServerEvents.recipes(e => {
    e.recipes.occultism.spirit_trade(
        'minecraft:rotten_flesh',
        'minecraft:bone'
    );

    e.recipes.occultism.spirit_fire(
        'minecraft:emerald_ore',
        '#forge:gems/emerald'
    );

    e.recipes.occultism.crushing(
        '2x #forge:ores/iron',
        '#forge:tools/swords'
    );
});
```

### OriTech

[Back to top](#mod-register)

```js
ServerEvents.recipes(e => {
    e.recipes.oritech.pulverizer(
        'minecraft:sponge',
        'minecraft:coal_block'
    ).time(100);

    e.recipes.oritech.grinder(
        'minecraft:sponge',
        'minecraft:iron_block'
    ).time(80);

    e.recipes.oritech.refinery(
        [],
        [
            FluidOutput.of('minecraft:water', 500),
            FluidOutput.of('minecraft:lava', 250)
        ],
        ['minecraft:coal', 'minecraft:redstone'],
        FluidInput.of('oritech:still_naphtha', 1000)
    ).time(120);
});
```

Keep OriTech fluid inputs and outputs under the fluid register as well as in the addon recipe notes.

### Rechiseled

[Back to top](#mod-register)

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

Use arrays and loops for large families of related blocks.

### Replication

[Back to top](#mod-register)

Replication uses startup registry data for matter types and server recipes or values for item mapping. Keep matter types, item values, tag values, and overrides as separate subsections.

```js
StartupEvents.registry('replication:matter_types', e => {
    e.create('example_matter')
        .displayName('Example Matter')
        .color(0x66CCFF);
});

ServerEvents.recipes(e => {
    Replication.matterValueForItem(
        'kubejs:example_item',
        'replication:example_matter',
        100
    );

    Replication.matterValueForTag(
        '#forge:ingots/example',
        'replication:example_matter',
        50
    );
});
```

Confirm the exact Replication method signatures against ProbeJS before adding a large batch.

## Custom KubeJS content

[Back to top](#mod-register)

### Custom items

[Back to top](#mod-register)

```js
StartupEvents.registry('item', e => {
    e.create('example_item', 'basic')
        .displayName('Example Item')
        .texture('kubejs:item/example_item');
});
```

The namespace is independent from the display name. `kubejs:example_item` is the normal ID, but custom content can use another namespace when that namespace is registered and available to the pack. Record the chosen namespace here so recipes and assets agree.

### Custom blocks

[Back to top](#mod-register)

```js
StartupEvents.registry('block', e => {
    e.create('example_block')
        .displayName('Example Block')
        .material('stone');
});
```

Record the block ID, item form, material, hardness, sound, tool requirements, and model behavior.

### Textures and models

[Back to top](#mod-register)

For an item ID such as `kubejs:example_item`, the usual resource paths are:

```text
kubejs/assets/kubejs/models/item/example_item.json
kubejs/assets/kubejs/textures/item/example_item.png
```

The model commonly points to:

```json
{
  "parent": "item/generated",
  "textures": {
    "layer0": "kubejs:item/example_item"
  }
}
```

If a custom namespace is used, replace both `kubejs` namespace components with that namespace and keep the ID, model path, and texture path consistent.

## ProbeJS dump layout

[Back to top](#mod-register)

Current companion files for the live dumps:

```text
CobbleAOI-Docs/
  modregister.md
    modregister-items.md
    modregister-blocks.md
    modregister-fluids.md
    modregister-gases.md
  modregister-tags.md
  modregister-recipes.md
```

Keep `modregister.md` focused on navigation, verified patterns, and important pack-specific notes. Put raw ProbeJS output in the companion file for its category, then link it from the matching section above.

## External references

[Back to top](#mod-register)

- [KubeJS documentation](https://kubejs.com/)
- [KubeJS Create addon](https://kubejs.com/wiki/addons/create)
- [ProbeJS project page](https://www.curseforge.com/minecraft/mc-mods/probejs)
- [KubeJS addon reference](kubejs-addons.html)
