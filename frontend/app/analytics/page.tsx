'use client'

import { useEffect, useState } from 'react'

import {

  ResponsiveContainer,

  PieChart,

  Pie,

  Cell,

  BarChart,

  Bar,

  XAxis,

  YAxis,

  Tooltip

} from 'recharts'

export default function AnalyticsPage() {

  const [data, setData] = useState<any>(null)
  const budgetData=[

 {name:'Camera',value:4},

 {name:'Lighting',value:3},

 {name:'Travel',value:2},

 {name:'Locations',value:4}

]

const crewData=[

 {day:'Mon',crew:18},

 {day:'Tue',crew:21},

 {day:'Wed',crew:24},

 {day:'Thu',crew:22},

 {day:'Fri',crew:26}

]

const colors=[

 '#C9A84C',

 '#60a5fa',

 '#4ade80',

 '#a78bfa'

]

  useEffect(() => {

    async function load() {

      const response = await fetch(

        'http://localhost:8000/api/analytics/overview'

      )

      const analytics = await response.json()

      setData(analytics)

    }

    load()

  }, [])

  if (!data)

    return (

      <div className="min-h-screen bg-[#080810] text-white p-10">

        Loading...

      </div>

    )

  return (

    <div className="min-h-screen bg-[#080810] text-white p-10">

      <h1 className="text-5xl font-bold mb-10">

        📊 Analytics Dashboard

      </h1>

      <div className="grid grid-cols-3 gap-6 mb-10">

        <Card

          title="Total Budget"

          value={`₹${data.total_budget}`}

        />

        <Card

          title="Spent"

          value={`₹${data.spent}`}

        />

        <Card

          title="Remaining"

          value={`₹${data.remaining}`}

        />

        <Card

          title="Scenes"

          value={`${data.scenes_completed}/${data.total_scenes}`}

        />

        <Card

          title="Crew"

          value={`${data.crew_active}/${data.crew_total}`}

        />

        <Card

          title="Shoot Days"

          value={`${data.shoot_days}/${data.shoot_total}`}

        />

      </div>

      <div className="bg-slate-900 p-6 rounded-xl">

        <h2 className="text-2xl mb-5">

          Risk Alerts

        </h2>

        {data.alerts.map(

          (alert:string,index:number)=>(

            <div

              key={index}

              className="mb-3"

            >

              {alert}

            </div>

          )

        )}

      </div>
<div
className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
mb-10
">

<div className="bg-slate-900 p-6 rounded-xl">

<h2 className="text-2xl mb-5">

Budget Distribution

</h2>

<ResponsiveContainer

width="100%"

height={300}

>

<PieChart>

<Pie

data={budgetData}

dataKey="value"

>

{

budgetData.map(

(_,i)=>(

<Cell

key={i}

fill={colors[i]}

/>

)

)

}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

<div className="bg-slate-900 p-6 rounded-xl">

<h2 className="text-2xl mb-5">

Crew Utilization

</h2>

<ResponsiveContainer

width="100%"

height={300}

>

<BarChart

data={crewData}

>

<XAxis dataKey="day"/>

<YAxis/>

<Tooltip/>

<Bar

dataKey="crew"

fill="#C9A84C"

/>

</BarChart>

</ResponsiveContainer>

</div>

</div>
    </div>
    

  )

}

function Card({

  title,

  value

}:{

  title:string,

  value:string

}) {

  return (

    <div className="bg-slate-900 p-6 rounded-xl">

      <div className="text-gray-400 mb-2">

        {title}

      </div>

      <div className="text-4xl font-bold">

        {value}

      </div>

    </div>

  )

}