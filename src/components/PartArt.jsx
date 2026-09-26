import { useId } from 'react'

export default function PartArt({ type, className = '' }) {
  const id = useId().replaceAll(':', '')
  const metal = 'url(#' + id + '-metal)'
  const dark = 'url(#' + id + '-dark)'
  return (
    <svg className={className} viewBox="0 0 260 190" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id + '-metal'} x1="50" y1="20" x2="195" y2="170" gradientUnits="userSpaceOnUse"><stop stopColor="#f5f6f7"/><stop offset=".32" stopColor="#a5acb2"/><stop offset=".51" stopColor="#e2e5e7"/><stop offset="1" stopColor="#626c75"/></linearGradient>
        <linearGradient id={id + '-dark'} x1="65" y1="30" x2="185" y2="165" gradientUnits="userSpaceOnUse"><stop stopColor="#555c63"/><stop offset=".5" stopColor="#171c21"/><stop offset="1" stopColor="#373e44"/></linearGradient>
      </defs>
      <ellipse cx="134" cy="169" rx="77" ry="9" fill="#19212b" opacity=".08"/>
      {type === 'brake' && <g transform="rotate(-20 130 95)">
        <ellipse cx="136" cy="99" rx="70" ry="65" fill="#646b70"/>
        <circle cx="130" cy="91" r="67" fill={metal} stroke="#919aa1" strokeWidth="2"/>
        <circle cx="130" cy="91" r="55" stroke="#7c858b" strokeWidth="1"/>
        <circle cx="130" cy="91" r="31" fill="#69737c"/><circle cx="130" cy="91" r="24" fill={metal}/><circle cx="130" cy="91" r="12" fill="#272e34"/>
        {Array.from({ length: 16 }, (_, i) => <g key={i} transform={'rotate(' + i * 22.5 + ' 130 91)'}><rect x="127" y="36" width="3" height="11" rx="1.5" fill="#657079"/><circle cx="145" cy="49" r="2" fill="#667078"/></g>)}
        {[0, 72, 144, 216, 288].map((angle) => <circle key={angle} cx="130" cy="73" r="3" fill="#353c42" transform={'rotate(' + angle + ' 130 91)'}/>)}
        <path d="M178 52 Q204 57 205 87 L198 115 L179 112 L178 85 L168 68Z" fill="#e95027"/><path d="M186 64 L195 69 M187 77 L199 82 M188 92 L198 95" stroke="#ff9a74" strokeWidth="3"/>
      </g>}
      {type === 'filter' && <g transform="rotate(-16 130 95)"><path d="M54 48 L190 40 L210 139 L69 152Z" fill="#242a2d"/><path d="M63 53 L184 48 L200 132 L76 143Z" fill="#dd7a32"/>
        {Array.from({ length: 19 }, (_, i) => <path key={i} d={'M' + (69 + i * 6.2) + ' ' + (57 - i * .26) + ' l13 77'} stroke={i % 2 ? '#dfbe79' : '#f5dda1'} strokeWidth="4"/>)}
        <path d="M54 48 L190 40 L210 139 L69 152Z" stroke="#353c40" strokeWidth="9"/>
      </g>}
      {type === 'shock' && <g transform="rotate(27 130 95)"><rect x="122" y="15" width="17" height="149" rx="5" fill={metal}/><rect x="115" y="67" width="30" height="87" rx="8" fill="#e77b20"/><rect x="115" y="66" width="30" height="10" rx="3" fill="#343c43"/>
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={'M106 ' + (39 + i * 9) + ' Q130 ' + (26 + i * 9) + ' 152 ' + (40 + i * 9) + ' Q134 ' + (50 + i * 9) + ' 108 ' + (44 + i * 9)} stroke="#30383f" strokeWidth="6"/>)}
        <rect x="109" y="26" width="43" height="7" rx="3" fill={metal}/><circle cx="130" cy="161" r="10" fill="#3c444c"/><circle cx="130" cy="161" r="4" fill="#c0c6cc"/>
      </g>}
      {type === 'light' && [0, 1].map((n) => <g key={n} transform={'translate(' + (n * 68 - 28) + ' ' + (n * 13) + ') rotate(-16 120 100)'}><rect x="112" y="31" width="20" height="59" rx="4" fill={metal}/><rect x="117" y="40" width="10" height="23" rx="2" fill="#ffe27d"/><rect x="105" y="87" width="34" height="13" rx="3" fill="#919ca5"/><path d="M99 101 H145 L138 142 H106Z" fill={dark}/>{[0,1,2,3,4].map(i => <path key={i} d={'M103 ' + (106+i*7) + ' H140'} stroke="#788189" strokeWidth="2"/>)}<path d="M122 142 V154 Q122 164 145 159" stroke="#252d34" strokeWidth="6"/></g>)}
      {type === 'tyre' && <g transform="rotate(-15 130 95)"><ellipse cx="139" cy="92" rx="62" ry="76" fill="#20262b"/><ellipse cx="121" cy="92" rx="56" ry="75" fill={dark}/><ellipse cx="119" cy="92" rx="38" ry="52" fill={metal}/><ellipse cx="119" cy="92" rx="30" ry="44" fill="#252d34"/>{[0,60,120,180,240,300].map(a => <path key={a} d="M116 90 L107 50 L119 47 L125 90Z" fill={metal} transform={'rotate(' + a + ' 119 92)'}/>)}<ellipse cx="119" cy="92" rx="11" ry="14" fill="#a4adb4"/><path d="M162 34 L180 43 M170 53 L191 65 M176 76 L198 87 M176 102 L197 112 M170 127 L189 136 M159 149 L175 155" stroke="#465057" strokeWidth="3"/></g>}
      {type === 'battery' && <g><path d="M66 60 L157 45 L198 67 L109 86Z" fill="#596068"/><path d="M66 60 L109 86 V157 L66 129Z" fill="#252d33"/><path d="M109 86 L198 67 V139 L109 157Z" fill={dark}/><path d="M77 52 L158 39 L192 55 L109 74Z" fill="#252d33"/><rect x="87" y="43" width="16" height="13" rx="3" fill="#ce4f35"/><rect x="164" y="36" width="15" height="14" rx="3" fill="#aeb5bd"/><path d="M124 91 L183 79 V124 L124 137Z" fill="#f17a32"/><path d="M152 92 L139 111 H153 L146 129 L169 105 H153Z" fill="#fff1d7"/><path d="M103 45 V29 L148 22 V40" stroke="#636c75" strokeWidth="7"/></g>}
    </svg>
  )
}
