import PartArt from './PartArt'
import { useProductImages } from '../store/productImages'
export default function ProductVisual({ product, photoIndex = 0 }) {
 const legacyImage = useProductImages(state => state.images[product.id])
 const photo = product.photos?.[photoIndex] || product.photos?.[0]
 const image = photo?.url || legacyImage
 return image ? <img className="product-uploaded-image" src={image} alt={photo?.alt || product.name} /> : <PartArt type={product.type} />
}
