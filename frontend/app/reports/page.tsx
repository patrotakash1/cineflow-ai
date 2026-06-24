"use client";

import { useState } from "react";

export default function ReportsPage() {

  const [date, setDate] = useState("");

  const [scenes, setScenes] = useState("");

  const [hours, setHours] = useState("");

  const [crew, setCrew] = useState("");

  const [expenses, setExpenses] = useState("");

  const [issues, setIssues] = useState("");

  const [notes, setNotes] = useState("");

  const [summary, setSummary] =

    useState<string[]>([]);

  async function generate() {

    const response = await fetch(

      "http://localhost:8000/api/reports/generate",

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          date,

          scenes_completed:

            Number(scenes),

          hours_worked:

            Number(hours),

          crew_present:

            Number(crew),

          expenses:

            Number(expenses),

          issues,

          director_notes: notes

        })

      }

    );

    const data = await response.json()
    console.log(data)

setSummary(data.summary || [])
  }

  return (

    <div className="min-h-screen bg-[#080810] text-white p-10">

      <h1 className="text-4xl font-bold mb-10">

        📋 Daily Reports

      </h1>

      <div className="max-w-xl space-y-4">

        <input

          className="w-full p-4 rounded bg-slate-900"

          placeholder="Date"

          onChange={(e)=>

            setDate(e.target.value)

          }

        />

        <input

          className="w-full p-4 rounded bg-slate-900"

          placeholder="Scenes Completed"

          onChange={(e)=>

            setScenes(e.target.value)

          }

        />

        <input

          className="w-full p-4 rounded bg-slate-900"

          placeholder="Hours Worked"

          onChange={(e)=>

            setHours(e.target.value)

          }

        />

        <input

          className="w-full p-4 rounded bg-slate-900"

          placeholder="Crew Present"

          onChange={(e)=>

            setCrew(e.target.value)

          }

        />

        <input

          className="w-full p-4 rounded bg-slate-900"

          placeholder="Expenses"

          onChange={(e)=>

            setExpenses(e.target.value)

          }

        />

        <textarea

          className="w-full p-4 rounded bg-slate-900"

          placeholder="Issues"

          onChange={(e)=>

            setIssues(e.target.value)

          }

        />

        <textarea

          className="w-full p-4 rounded bg-slate-900"

          placeholder="Director Notes"

          onChange={(e)=>

            setNotes(e.target.value)

          }

        />

        <button

          onClick={generate}

          className="bg-[#C9A84C] text-black px-6 py-3 rounded"

        >

          Generate Report

        </button>

      </div>

      <div className="mt-10 space-y-4">

        {(summary || []).map(

          (item, index)=>(

            <div

              key={index}

              className="bg-slate-900 p-5 rounded"

            >

              {item}

            </div>

          )

        )}

      </div>

    </div>

  )

}