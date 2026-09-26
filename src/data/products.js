export const vehicles = {
  Ford: ['F-150', 'F-250 Super Duty', 'F-350 Super Duty', 'Ranger', 'Explorer'],
  Toyota: ['Tacoma', 'Tundra', '4Runner', 'RAV4', 'Camry'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey'],
  Chevrolet: ['Silverado 1500', 'Colorado', 'Tahoe', 'Suburban', 'Equinox'],
  GMC: ['Sierra 1500', 'Canyon', 'Yukon', 'Yukon XL', 'Acadia'],
  RAM: ['1500', '2500', '3500', 'ProMaster', 'ProMaster City'],
}
export const vehicleYears = Array.from({ length: 27 }, (_, index) => 2026 - index)
export const categorySlug = name => name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')
const departments = [
  ['Brakes', 'brake', ['Ceramic brake pads', 'Vented brake rotor', 'Brake disc & pad kit'], [49, 89, 179]],
  ['Engine', 'filter', ['Engine air filter', 'Premium intake filter', 'Engine filter kit'], [19, 39, 69]],
  ['Suspension', 'shock', ['Shock absorber', 'Performance strut', 'Suspension upgrade kit'], [79, 139, 299]],
  ['Lighting', 'light', ['Headlight bulb pair', 'LED headlight kit', 'Premium lighting kit'], [29, 69, 129]],
  ['Tyres & wheels', 'tyre', ['Touring tyre', 'All-terrain tyre', 'Performance wheel'], [99, 169, 249]],
  ['Accessories', 'battery', ['Maintenance-free battery', 'Premium starting battery', 'High-capacity battery'], [89, 139, 199]],
]
const brands = ['EVERYDAY ESSENTIALS', 'AUTOFORGE SELECT', 'ROAD & VISION']
// Illustrative catalog only: prices and vehicle associations are not verified inventory or fitment.
export const products = departments.flatMap(([category, type, names, prices]) =>
  Object.entries(vehicles).flatMap(([make, models]) => models.flatMap((model, modelIndex) =>
    names.map((name, variant) => ({
      id: [categorySlug(category), make, model, variant].join('-'),
      name, brand: brands[variant], category, type,
      price: prices[variant] + modelIndex * 5 + .99,
      tag: variant === 1 ? 'SELECT SERIES' : '',
      make, model, fit: [make + ' ' + model], years: vehicleYears,
    }))),
  ),
)
export const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
