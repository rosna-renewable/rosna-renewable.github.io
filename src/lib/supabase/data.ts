import type { Solar } from "./client";

export const entries = [
  { label: 'Id', get: (solar: Solar) => '0x' + solar.id.toString(16).padStart(8, '0') },
  { label: 'Price', get: (solar: Solar) => solar.price, max: 200000 },
  { label: 'Watt', get: (solar: Solar) => solar.watt, max: 1000 },
  { label: 'Battery Ah', get: (solar: Solar) => solar.battery, max: 1000 },
  { label: 'Battery Count', get: (solar: Solar) => solar.battery_count, max: 10 },
  { label: 'Total Battery Ah', get: (solar: Solar) => solar.battery * solar.battery_count, max: 1000 },
  { label: 'Charge Controller', get: (solar: Solar) => solar.charge_crt, max: 100 },
  { label: 'Panel Cabel (ft)', get: (solar: Solar) => solar.panel_cable, max: 100 },
  { label: 'Wiring Cabel (ft)', get: (solar: Solar) => solar.wiring_cable, max: 100 },
  { label: 'DC LED Light', get: (solar: Solar) => solar.dc_led, max: 20 },
  { label: 'DC Fan Small', get: (solar: Solar) => solar.dc_fan_small, max: 20 },
  { label: 'DC Fan Table', get: (solar: Solar) => solar.dc_fan_table, max: 20 },
  { label: 'DC Fan Stand', get: (solar: Solar) => solar.dc_fan_stand, max: 20 },
  {
    label: 'DC Fan Total',
    get: (solar: Solar) => solar.dc_fan_small + solar.dc_fan_table + solar.dc_fan_stand, max: 50
  },
  { label: 'Mobile Charger', get: (solar: Solar) => solar.mobile },
  { label: 'Structure + Other Accessories', get: (solar: Solar) => solar.struct },
  { label: 'Runtime Light + Fan (Hour)', get: (solar: Solar) => solar.light_fan, max: 50 },
  { label: 'Runtime Fan Extra (Hour)', get: (solar: Solar) => solar.light_fan, max: 50 }
];

