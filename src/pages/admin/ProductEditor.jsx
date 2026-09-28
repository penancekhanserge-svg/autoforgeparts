import { useCollections } from '../../store/collections'
import { compressProductImage } from '../../lib/compressProductImage'
import NotificationMessage from '../../components/NotificationMessage'
import { useEffect, useRef, useState } from 'react'
import { FiX, FiUploadCloud, FiTrash2, FiStar } from 'react-icons/fi'
import { vehicles, vehicleYears } from '../../data/products'
import { newProduct, editProduct } from '../../lib/productModel'
import { useCatalog } from '../../store/catalog'

export default function ProductEditor({ product, onClose }) {
 const collections=useCollections(state=>state.collections)
 const [draft, setDraft] = useState(() => product ? editProduct(product) : newProduct())
 const [error,setError] = useState('')
 const [uploading,setUploading] = useState(false)
 const [dirty,setDirty] = useState(false)
 const [yearMode,setYearMode] = useState(() => product && Math.min(...product.years) === Math.max(...product.years) ? 'single' : 'range')
 const dialog = useRef(null)
 const mounted = useRef(true)
 const saving = useCatalog(state=>state.saving)
 const save = useCatalog(state=>state.saveProduct)
 const busy = saving || uploading
 useEffect(()=>{ mounted.current=true; dialog.current.showModal(); return ()=>{mounted.current=false} },[])
 useEffect(()=>{ const warn=event=>{ if(dirty){event.preventDefault();event.returnValue=''} }; window.addEventListener('beforeunload',warn); return ()=>window.removeEventListener('beforeunload',warn) },[dirty])
 const update=(key,value)=>{setDraft(current=>({...current,[key]:value}));setDirty(true)}
 const close=()=>{if(busy)return;onClose()}
 async function upload(event) {
  const files=Array.from(event.target.files); event.target.value='';setError('')
  if(!files.length)return
  if(files.length>1){setError('Choose one product photo.');return}
  setUploading(true)
  try {
   const photos=[]
   for(const file of files){
    const url=await compressProductImage(file)
    photos.push({url,alt:file.name.replace(/\.[^.]+$/,'')})
   }
   if(mounted.current){setDraft(current=>({...current,photos}));setDirty(true)}
  }catch(err){if(mounted.current)setError(err.message)}finally{if(mounted.current)setUploading(false)}
 }
 async function submit(event){event.preventDefault();setError('');try{await save({...draft,photos:draft.photos.slice(0,1),yearTo:yearMode==='single'?draft.yearFrom:draft.yearTo,status:'active'});onClose('Product saved.')}catch(err){setError(err.message)}}
 return <dialog ref={dialog} className="adm-editor adm-editor-organized" aria-labelledby="editor-title" onCancel={event=>{event.preventDefault();close()}}><form onSubmit={submit}><header><div><span className="adm-eyebrow">CATALOG STUDIO</span><h2 id="editor-title">{product?'Edit product':'Create a product'}</h2></div><button type="button" className="adm-icon" disabled={busy} onClick={close} aria-label="Close editor"><FiX /></button></header>
 <fieldset disabled={busy}><div className="adm-editor-grid"><div><section className="adm-form-section"><h3>01 / Product essentials</h3><label>Product name<input required maxLength={100} value={draft.name} onChange={e=>update('name',e.target.value)} /></label><label>Collection<select value={draft.category} onChange={e=>update('category',e.target.value)}>{collections.map(item=><option key={item.name}>{item.name}</option>)}</select></label></section>
 <section className="adm-form-section"><h3>02 / Vehicle compatibility</h3><div className="adm-form-row"><label>Make<select value={draft.make} onChange={e=>{setDraft(current=>({...current,make:e.target.value,model:vehicles[e.target.value][0]}));setDirty(true)}}>{Object.keys(vehicles).map(value=><option key={value}>{value}</option>)}</select></label><label>Model<select value={draft.model} onChange={e=>update('model',e.target.value)}>{vehicles[draft.make].map(value=><option key={value}>{value}</option>)}</select></label><label>Year selection<select value={yearMode} onChange={e=>{setYearMode(e.target.value);setDirty(true)}}><option value="single">Specific year</option><option value="range">Year range</option></select></label><label>{yearMode==='single'?'Year':'From year'}<select value={draft.yearFrom} onChange={e=>update('yearFrom',e.target.value)}>{vehicleYears.map(value=><option key={value}>{value}</option>)}</select></label>{yearMode==='range'&&<label>To year<select value={draft.yearTo} onChange={e=>update('yearTo',e.target.value)}>{vehicleYears.map(value=><option key={value}>{value}</option>)}</select></label>}</div></section></div>
 <div><section className="adm-form-section"><h3>03 / Product photography</h3><label className="adm-upload-compact"><FiUploadCloud /><strong>{uploading?'Compressing photos...':'Add photos'}</strong><span>One photo, compressed to 1 MB or less.</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} /></label><div className="adm-photo-grid">{draft.photos.slice(0,1).map((photo,index)=><div key={index}><img src={photo.url} alt={photo.alt} /><label>Alternative text<input maxLength={160} value={photo.alt} onChange={e=>update('photos',draft.photos.map((p,i)=>i===index?{...p,alt:e.target.value}:p))} /></label><div><button type="button" onClick={()=>update('photos',[photo,...draft.photos.filter((_,i)=>i!==index)])} aria-label={'Set photo '+(index+1)+' as cover'}><FiStar />{index===0?'Cover':'Set cover'}</button><button type="button" aria-label={'Remove photo '+(index+1)} onClick={()=>update('photos',draft.photos.filter((_,i)=>i!==index))}><FiTrash2 /></button></div></div>)}</div></section>
 <section className="adm-form-section"><h3>04 / Price & availability</h3><div className="adm-form-row"><label>Price (USD)<input type="number" min="0" max="1000000" step="0.01" required value={draft.price} onChange={e=>update('price',e.target.value)} /></label><label>Discount (%) (optional)<input type="number" min="0" max="100" step="0.1" placeholder="No discount" value={draft.discountPercent || ''} onChange={e=>update('discountPercent',e.target.value)} /></label></div><label>Availability<select value={Number(draft.stock)===0?'sold-out':'in-stock'} onChange={e=>update('stock',e.target.value==='sold-out'?0:Math.max(1,Number(draft.stock)))}><option value="in-stock">In stock</option><option value="sold-out">Sold out</option></select></label></section></div></div></fieldset>
 {error&&<NotificationMessage message={error} />}
 <footer><button type="button" className="adm-secondary" disabled={busy} onClick={close}>Cancel</button><button className="adm-primary" disabled={busy} type="submit">{busy?'Please wait...':'Save product'}</button></footer></form></dialog>
}
