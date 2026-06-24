'use client'

import { useEffect,useState } from 'react'

export default function NotificationsPage(){

const [items,setItems]=useState<any[]>([])

useEffect(()=>{

fetchNotifications()

},[])


async function fetchNotifications(){

const res=await fetch(

'${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/notifications/'

)

const data=await res.json()

setItems(data)

}


return(

<div style={{

background:'#080810',

minHeight:'100vh',

padding:40,

color:'white'

}}>

<h1 style={{

fontSize:40,

marginBottom:30

}}>

🔔 Notifications

</h1>


{items.map((n)=>{

let color='#60a5fa'

if(n.type==='warning')

color='#f59e0b'

if(n.type==='success')

color='#4ade80'


return(

<div

key={n.id}

style={{

background:'rgba(255,255,255,0.03)',

borderLeft:`4px solid ${color}`,

padding:20,

borderRadius:12,

marginBottom:16

}}

>

<div style={{

fontSize:18,

fontWeight:600

}}>

{n.title}

</div>

<div style={{

marginTop:8,

opacity:0.7

}}>

{n.message}

</div>

</div>

)

})}

</div>

)

}