---
layout: page
title: Gas Register
---

# Gas Register

Live gas and gas-like resources found through ProbeJS tag queries in this pack.

These are kept separate from [modregister-fluids.md](modregister-fluids.html) because some are exposed through mod-specific gas handlers while others are represented as fluid resources with gas tags.

## `c:gaseous`

- `mekanism:steam`
- `mekanism:flowing_steam`
- `immersiveengineering:acetaldehyde`
- `immersivepetroleum:petroleum_gas`
- `oritech:flowing_steam`
- `oritech:still_steam`
- `modern_industrialization:acetylene`
- `modern_industrialization:argon`
- `modern_industrialization:chlorine`
- `modern_industrialization:deuterium`
- `modern_industrialization:ethylene`
- `modern_industrialization:heavy_water_steam`
- `modern_industrialization:helium`
- `modern_industrialization:helium_3`
- `modern_industrialization:helium_plasma`
- `modern_industrialization:high_pressure_heavy_water_steam`
- `modern_industrialization:high_pressure_steam`
- `modern_industrialization:hydrogen`
- `modern_industrialization:methane`
- `modern_industrialization:nitrogen`
- `modern_industrialization:oxygen`
- `modern_industrialization:polyvinyl_chloride`
- `modern_industrialization:steam`
- `modern_industrialization:tritium`

## `tfmg:gas`

- `tfmg:flowing_lpg`
- `tfmg:lpg`
- `tfmg:flowing_butane`
- `tfmg:butane`
- `tfmg:flowing_propane`
- `tfmg:propane`
- `tfmg:flowing_hydrogen`
- `tfmg:hydrogen`
- `tfmg:flowing_furnace_gas`
- `tfmg:furnace_gas`
- `tfmg:flowing_ethylene`
- `tfmg:ethylene`
- `tfmg:flowing_propylene`
- `tfmg:propylene`
- `tfmg:flowing_neon`
- `tfmg:neon`
- `tfmg:flowing_carbon_dioxide`
- `tfmg:carbon_dioxide`
- `tfmg:flowing_air`
- `tfmg:air`
- `tfmg:flowing_hot_air`
- `tfmg:hot_air`

## Notes

- ProbeJS did not expose a `mekanism:gas` registry in this runtime query.
- Use each mod's own gas API or recipe format for gas amounts and handlers.
- [modregister-fluids.md](modregister-fluids.html) contains the full Minecraft fluid registry, including entries that also appear in these gas tags.
