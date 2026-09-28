export function vehicleYearLabel(years) {
 if (!Array.isArray(years) || !years.length) return ''
 const values=years.map(Number).filter(Number.isInteger)
 if(!values.length)return ''
 const first=Math.min(...values),last=Math.max(...values)
 return first===last?String(first):first+'-'+last
}
