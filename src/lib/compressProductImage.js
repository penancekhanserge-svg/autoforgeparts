export async function compressProductImage(file) {
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Choose a JPEG, PNG, or WebP image.')
 if(file.size>30000000)throw new Error('Choose an original image under 30 MB.')
 const bitmap=await createImageBitmap(file)
 try {
  const canvas=document.createElement('canvas')
  let scale=Math.min(1,1800/Math.max(bitmap.width,bitmap.height))
  for(let attempt=0;attempt<12;attempt++){
   canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale))
   canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height)
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',Math.max(.45,.85-attempt*.05)))
   if(blob && blob.size<=1000000)return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('Unable to read compressed image.'));reader.readAsDataURL(blob)})
   scale*=.8
  }
  throw new Error('Unable to compress this image to 1 MB. Please choose another image.')
 } finally {bitmap.close()}
}
