import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { FiPlus, FiX } from 'react-icons/fi'
import { useCollections } from '../../store/collections'
import { departmentTypes } from '../../lib/productModel'
import PartArt from '../../components/PartArt'
export default function Collections(){
 const {collections,addCollection}=useCollections()
 const dialog=useRef(null)
 const [name,setName]=useState(''),[description,setDescription]=useState(''),[type,setType]=useState('brake')
 function save(e){e.preventDefault();try{addCollection({name,description,type});dialog.current.close();setName('');setDescription('');toast.success('Collection added.')}catch(err){toast.error(err.message)}}
 return <><div className="adm-panel-title"><span>{collections.length} collections</span><button className="adm-primary" onClick={()=>dialog.current.showModal()}><FiPlus /> Add collection</button></div><div className="adm-collections-grid">{collections.map(item=><article className="adm-panel" key={item.name}><PartArt type={item.type} /><h2>{item.name}</h2><p>{item.description}</p></article>)}</div><dialog ref={dialog} className="adm-confirm" aria-labelledby="collection-title"><form onSubmit={save}><div className="adm-panel-title"><h2 id="collection-title">Add collection</h2><button className="adm-icon" type="button" onClick={()=>dialog.current.close()} aria-label="Close"><FiX /></button></div><label>Collection name<input required maxLength={60} value={name} onChange={e=>setName(e.target.value)} /></label><label>Short introduction<input maxLength={140} value={description} onChange={e=>setDescription(e.target.value)} /></label><label>Illustration<select value={type} onChange={e=>setType(e.target.value)}>{Object.entries(departmentTypes).map(([label,value])=><option key={value} value={value}>{label}</option>)}</select></label><p>Collections are saved in this browser alongside your local catalog.</p><button className="adm-primary" type="submit">Add collection</button></form></dialog></>
}
