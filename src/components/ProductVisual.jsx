import PartArt from './PartArt'
import { useProductImages } from '../store/productImages'
export default function ProductVisual({ product }) {
 const image = useProductImages(state => state.images[product.id])
 return image ? <img className="product-uploaded-image" src={image} alt={product.name} /> : <PartArt type={product.type} />
}
