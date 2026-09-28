import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiArrowRight, FiTruck } from 'react-icons/fi'
import { vehicles } from '../data/products'
import './ShopByVehicle.css'

const vehicleLink = (make, model = '') => '/shop?' + new URLSearchParams({ make, model, year: '' }).toString()

export default function ShopByVehicle() {
 return <section className="vehicle-collections" aria-labelledby="vehicle-collections-title"><div className="container">
  <header className="vehicle-collections-heading"><div><span className="eyebrow">YOUR VEHICLE. YOUR NEXT UPGRADE.</span><h2 id="vehicle-collections-title">Shop by <em>vehicle.</em></h2><p>Start with your make and model. Explore parts for the way you drive.</p></div><a href="#finder" className="vehicle-finder-link"><FiTruck /> Find your fit <FiArrowUpRight /></a></header>
  <div className="vehicle-collections-grid">{Object.entries(vehicles).map(([make, models], index) => <article className="vehicle-collection" key={make}><header><div className="vehicle-card-topline"><span className="vehicle-collection-index">0{index+1} / THE GARAGE</span><FiTruck aria-hidden="true" /></div><Link to={vehicleLink(make)} aria-label={'Shop all '+make+' parts'}><h3>{make}</h3><FiArrowUpRight /></Link><span className="vehicle-model-count">{models.length} models to explore</span></header><ul>{models.map(model=><li key={model}><Link to={vehicleLink(make,model)}><span>{model}</span><FiArrowRight aria-hidden="true" /></Link></li>)}</ul><Link className="vehicle-collection-all" to={vehicleLink(make)}>All {make} parts <FiArrowUpRight /></Link></article>)}</div>
  <div className="vehicle-collections-note"><span>BUILT AROUND YOUR DRIVE</span><p>Select your model, then narrow your search by year, collection, or price.</p></div>
 </div></section>
}
