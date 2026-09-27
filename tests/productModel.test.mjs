import test from 'node:test'
import assert from 'node:assert/strict'
import { newProduct, normalizeProduct, editProduct } from '../src/lib/productModel.js'
const draft = () => ({ ...newProduct(), name:'Brake kit', brand:'Example', sku:'BK-1', price:'49.99', stock:'4', yearFrom:2018, yearTo:2020 })
test('creates a stable catalog shape with USD price and exact fitment years',()=>{const product=normalizeProduct(draft(),[]);assert.ok(product.id);assert.equal(product.price,49.99);assert.equal(product.stock,4);assert.deepEqual(product.years,[2018,2019,2020]);assert.deepEqual(product.fit,['Ford F-150']);assert.equal(product.status,'draft');assert.equal(product.type,'brake')})
test('editing preserves identity and can publish',()=>{const product=normalizeProduct(draft(),[]);const updated=normalizeProduct({...editProduct(product),status:'active',price:'55'},[product]);assert.equal(updated.id,product.id);assert.equal(updated.price,55);assert.equal(updated.status,'active')})
test('rejects duplicate SKU, invalid price, stock, years, and fitment',()=>{const product=normalizeProduct(draft(),[]);assert.throws(()=>normalizeProduct({...draft(),sku:'bk-1'},[product]),/SKU/);for(const patch of [{price:-1},{price:''},{stock:1.5},{yearFrom:2025,yearTo:2019},{make:'Honda',model:'F-150'}])assert.throws(()=>normalizeProduct({...draft(),...patch},[]))})
