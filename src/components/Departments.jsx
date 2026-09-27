import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import PartArt from './PartArt'
import './Departments.css'

export default function Departments({ categories, onExplore, onBrowse }) {
  return (
    <section className="departments" aria-labelledby="departments-title">
      <div className="container">
        <div className="departments-heading">
          <div><span className="eyebrow">YOUR GARAGE. EVERY ESSENTIAL.</span><h2 id="departments-title">Engineered for<br /><em>your next mile.</em></h2><p>Explore precision parts for every system. Find the right upgrade for your vehicle.</p></div>
          <button className="departments-browse" onClick={onBrowse}>Browse everything <FiArrowUpRight /></button>
        </div>
        <div className="department-viewport"><div className="department-track">{[0, 1].map(copy => <div className="departments-grid" key={copy} aria-hidden={copy === 1 ? true : undefined}>{categories.map((category, index) => (
          <button className="department-card" tabIndex={copy === 1 ? -1 : 0} key={category.name} onClick={() => onExplore(category.name)} aria-label={'Shop ' + category.name}>
            <span className="department-art"><span className="department-number" aria-hidden="true">COLLECTION / 0{index + 1}</span><span className="department-orbit" aria-hidden="true" /><PartArt type={category.type} /><span className="department-explore" aria-hidden="true"><FiArrowUpRight /></span></span>
            <span className="department-copy"><span className="department-title">{category.name}</span><span className="department-description">{category.description}</span><span className="department-shop">Explore collection <FiArrowRight aria-hidden="true" /></span></span>
          </button>
        ))}</div>)}</div></div>
        <div className="departments-footnote"><span>THE RIGHT PART STARTS WITH THE RIGHT FIT.</span><a href="#finder">Start with your vehicle <FiArrowRight /></a></div>
      </div>
    </section>
  )
}
