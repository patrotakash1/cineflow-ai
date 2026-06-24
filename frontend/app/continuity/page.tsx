"use client";

import { useState } from "react";

export default function ContinuityPage() {

  const [scene, setScene] = useState("");

  const [description, setDescription] = useState("");

  const [costume, setCostume] = useState("");

  const [props, setProps] = useState("");

  const [time, setTime] = useState("Day");

  const [issues, setIssues] = useState<string[]>([]);

  async function check() {

    const response = await fetch(

      "${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/continuity/check",

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          scene_number: scene,

          description,

          costume,

          props,

          time_of_day: time

        })

      }

    );

    const data = await response.json();

    setIssues(data.issues);

  }

  return (

    <div className="min-h-screen bg-[#080810] text-white p-10">

      <h1 className="text-4xl font-bold mb-10">

        🧩 Continuity Checker

      </h1>

      <div className="max-w-xl space-y-4">

        <input

          className="w-full p-4 rounded bg-slate-900"

          placeholder="Scene Number"

          onChange={(e)=>setScene(e.target.value)}

        />

        <textarea

          className="w-full p-4 rounded bg-slate-900"

          placeholder="Description"

          onChange={(e)=>setDescription(e.target.value)}

        />

        <input

          className="w-full p-4 rounded bg-slate-900"

          placeholder="Costume"

          onChange={(e)=>setCostume(e.target.value)}

        />

        <input

          className="w-full p-4 rounded bg-slate-900"

          placeholder="Props"

          onChange={(e)=>setProps(e.target.value)}

        />

        <select

          className="w-full p-4 rounded bg-slate-900"

          onChange={(e)=>setTime(e.target.value)}

        >

          <option>Day</option>

          <option>Night</option>

        </select>

        <button

          onClick={check}

          className="bg-[#C9A84C] text-black px-6 py-3 rounded"

        >

          Check Continuity

        </button>

      </div>

      <div className="mt-12 space-y-4">

        {issues.map((item, index)=>(

          <div

            key={index}

            className="bg-slate-900 p-5 rounded"

          >

            {item}

          </div>

        ))}

      </div>

    </div>

  );

}