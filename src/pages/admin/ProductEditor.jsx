import { useEffect, useRef, useState } from 'react'
import { FiX, FiUploadCloud, FiTrash2, FiStar } from 'react-icons/fi'
import { vehicles, vehicleYears } from '../../data/products'
import { departmentTypes, newProduct, editProduct } from '../../lib/productModel'
import { useCatalog } from '../../store/catalog'

export default function ProductEditor({ product, onClose }) {
 const [draft, setDraft] = useState(() => product ? editProduct(product) : newProduct())
 const [error,setError] = useState('')
 const [uploading,setUploading] = useState(false)
 const [dirty,setDirty] = useState(false)
 const [discard,setDiscard] = useState(false)
 const dialog = useRef(null)
 const mounted = useRef(true)
 const saving = useCatalog(state=>state.saving)
 const save = useCatalog(state=>state.saveProduct)
 const busy = saving || uploading
 useEffect(()=>{ mounted.current=true; dialog.current.showModal(); return ()=>{mounted.current=false} },[])
 useEffect(()=>{ const warn=event=>{ if(dirty){event.preventDefault();event.returnValue=''} }; window.addEventListener('beforeunload',warn); return ()=>window.removeEventListener('beforeunload',warn) },[dirty])
 const update=(key,value)=>{setDraft(current=>({...current,[key]:value}));setDirty(true)}
 const close=()=>{if(busy)return;if(dirty)setDiscard(true);else onClose()}
 async function upload(event) {
  const files=Array.from(event.target.files); event.target.value='';setError('')
  if(!files.length)return
  if(draft.photos.length+files.length>4){setError('Choose up to four photos in total.');return}
  setUploading(true)
  try {
   const photos=[]
   for(const file of files){
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>2000000)throw new Error('Each photo must be a JPEG, PNG, or WebP under 2 MB.')
    const bitmap=await createImageBitmap(file);bitmap.close()
    const url=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('Unable to read image.'));reader.readAsDataURL(file)})
    photos.push({url,alt:file.name.replace(/\.[^.]+$/,'')})
   }
   if(mounted.current){setDraft(current=>({...current,photos:[...current.photos,...photos]}));setDirty(true)}
  }catch(err){if(mounted.current)setError(err.message)}finally{if(mounted.current)setUploading(false)}
 }
 async function submit(event){event.preventDefault();setError('');try{await save(draft);onClose('Product saved.')}catch(err){setError(err.message)}}
 return <dialog ref={dialog} className="adm-editor" aria-labelledby="editor-title" onCancel={event=>{event.preventDefault();close()}}><form onSubmit={submit}><header><div><span className="adm-eyebrow">CATALOG STUDIO</span><h2 id="editor-title">{product?'Edit product':'Create a product'}</h2></div><button type="button" className="adm-icon" disabled={busy} onClick={close} aria-label="Close editor"><FiX /></button></header>
 <fieldset disabled={busy}><div className="adm-editor-grid"><div><section className="adm-form-section"><h3>01 / Product essentials</h3><label>Product name<input required maxLength={100} value={draft.name} onChange={e=>update('name',e.target.value)} /></label><div className="adm-form-row"><label>SKU / Part number<input required maxLength={60} value={draft.sku} onChange={e=>update('sku',e.target.value)} /></label><label>Brand<input required maxLength={70} value={draft.brand} onChange={e=>update('brand',e.target.value)} /></label></div><label>Department<select value={draft.category} onChange={e=>update('category',e.target.value)}>{Object.keys(departmentTypes).map(value=><option key={value}>{value}</option>)}</select></label><label>Description<textarea rows={4} maxLength={3000} value={draft.description} onChange={e=>update('description',e.target.value)} placeholder="Explain what the product is and what is included." /></label><label>Technical specifications<textarea rows={3} maxLength={3000} value={draft.specifications} onChange={e=>update('specifications',e.target.value)} placeholder="Dimensions, materials, manufacturer references..." /></label><label>Warranty / Additional notes<textarea rows={2} maxLength={1000} value={draft.warranty} onChange={e=>update('warranty',e.target.value)} /></label></section>
 <section className="adm-form-section"><h3>02 / Vehicle compatibility</h3><div className="adm-form-row"><label>Make<select value={draft.make} onChange={e=>{setDraft(current=>({...current,make:e.target.value,model:vehicles[e.target.value][0]}));setDirty(true)}}>{Object.keys(vehicles).map(value=><option key={value}>{value}</option>)}</select></label><label>Model<select value={draft.model} onChange={e=>update('model',e.target.value)}>{vehicles[draft.make].map(value=><option key={value}>{value}</option>)}</select></label><label>From year<select value={draft.yearFrom} onChange={e=>update('yearFrom',e.target.value)}>{vehicleYears.map(value=><option key={value}>{value}</option>)}</select></label><label>To year<select value={draft.yearTo} onChange={e=>update('yearTo',e.target.value)}>{vehicleYears.map(value=><option key={value}>{value}</option>)}</select></label></div></section></div>
 <div><section className="adm-form-section"><h3>03 / Product photography</h3><label className="adm-drop"><FiUploadCloud /><strong>{uploading?'Reading photos...':'Choose product photos'}</strong><span>Up to 4 images. JPG, PNG, WebP. 2 MB each.</span><input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={upload} /></label><div className="adm-photo-grid">{draft.photos.map((photo,index)=><div key={index}><img src={photo.url} alt={photo.alt} /><label>Alternative text<input maxLength={160} value={photo.alt} onChange={e=>update('photos',draft.photos.map((p,i)=>i===index?{...p,alt:e.target.value}:p))} /></label><div><button type="button" onClick={()=>update('photos',[photo,...draft.photos.filter((_,i)=>i!==index)])} aria-label={'Set photo '+(index+1)+' as cover'}><FiStar />{index===0?'Cover':'Set cover'}</button><button type="button" aria-label={'Remove photo '+(index+1)} onClick={()=>update('photos',draft.photos.filter((_,i)=>i!==index))}><FiTrash2 /></button></div></div>)}</div><p>The cover image appears on product cards. Other photos appear in the image viewer.</p></section>
 <section className="adm-form-section"><h3>04 / Price & availability</h3><div className="adm-form-row"><label>Price (USD)<input type="number" min="0" max="1000000" step="0.01" required value={draft.price} onChange={e=>update('price',e.target.value)} /></label><label>Discount (%)<input type="number" min="0" max="100" step="0.1" value={draft.discountPercent ?? 0} onChange={e=>update('discountPercent',e.target.value)} /></label><label>Stock quantity<input type="number" min="0" max="1000000" step="1" required value={draft.stock} onChange={e=>update('stock',e.target.value)} /></label></div><label>Visibility<select value={draft.status} onChange={e=>update('status',e.target.value)}><option value="active">Published - visible in store</option><option value="draft">Draft - admin only</option></select></label><label>Product badge<input maxLength={30} value={draft.tag} onChange={e=>update('tag',e.target.value)} placeholder="e.g. New arrival" /></label></section></div></div></fieldset>
 {error&&<p role="alert" className="adm-error">{error}</p>}{discard&&<div className="adm-discard" role="alert"><p>Discard your unsaved changes?</p><button type="button" onClick={()=>setDiscard(false)}>Keep editing</button><button type="button" onClick={()=>onClose()}>Discard changes</button></div>}
 <footer><span>Saved locally in this browser.</span><button type="button" className="adm-secondary" disabled={busy} onClick={close}>Cancel</button><button className="adm-primary" disabled={busy} type="submit">{busy?'Please wait...':'Save product'}</button></footer></form></dialog>
}
