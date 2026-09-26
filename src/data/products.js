export const vehicles = {
  Toyota: ['Camry', 'Corolla', 'RAV4'],
  Honda: ['Accord', 'Civic', 'CR-V'],
  Ford: ['Focus', 'Ranger', 'Explorer'],
}
export const products = [
  { id: 'brake', name: 'Performance brake disc', brand: 'AUTOFORGE SELECT', category: 'Brakes', price: 48500, type: 'brake', tag: 'BEST SELLER', fit: ['Toyota Camry', 'Honda Accord'], years: [2018, 2019, 2020, 2021] },
  { id: 'filter', name: 'Premium engine air filter', brand: 'EVERYDAY ESSENTIALS', category: 'Engine', price: 12500, type: 'filter', tag: '', fit: ['Toyota Corolla', 'Honda Civic'], years: [2018, 2019, 2020, 2021, 2022] },
  { id: 'shock', name: 'Gas-charged shock absorber', brand: 'AUTOFORGE SELECT', category: 'Suspension', price: 65000, type: 'shock', tag: 'POPULAR PICK', fit: ['Toyota RAV4', 'Honda CR-V', 'Ford Ranger'], years: [2019, 2020, 2021, 2022, 2023] },
  { id: 'light', name: 'LED headlight bulb kit', brand: 'ROAD & VISION', category: 'Lighting', price: 28000, type: 'light', tag: '', fit: ['Toyota Camry', 'Honda Civic', 'Ford Focus'], years: [2018, 2019, 2020, 2021, 2022] },
  { id: 'tyre', name: 'All-season touring tyre', brand: 'ROAD & VISION', category: 'Tyres & wheels', price: 92000, type: 'tyre', tag: '', fit: ['Toyota Corolla', 'Honda Accord', 'Ford Focus'], years: [2020, 2021, 2022, 2023] },
  { id: 'battery', name: '12V maintenance-free battery', brand: 'EVERYDAY ESSENTIALS', category: 'Accessories', price: 78000, type: 'battery', tag: '', fit: ['Toyota RAV4', 'Honda CR-V', 'Ford Explorer'], years: [2018, 2019, 2020, 2021, 2022, 2023] },
]
export const money = (value) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value)
