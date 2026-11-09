import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { toolkit } from '../data/toolkit'

const groups=[...new Set(toolkit.map(item=>item.group))]

export default function Toolkit(){
  const [selected,setSelected]=useState('java')
  const item=toolkit.find(skill=>skill.id===selected)
  return <div className="skills-layout">
    <div className="skill-inventory" role="group" aria-label="Tecnologias e conhecimentos">
      {groups.map(group=><div className="skill-group" key={group}>
        <h3 className="skill-group-label">{group}</h3>
        {toolkit.filter(skill=>skill.group===group).map(skill=><button type="button" className={'skill-row '+(skill.id===selected?'chosen':'')} key={skill.id} onClick={()=>setSelected(skill.id)} aria-pressed={skill.id===selected} aria-controls="toolkit-detail">
          <span className="skill-no">{String(toolkit.indexOf(skill)+1).padStart(2,'0')}</span><span>{skill.name}</span><ArrowUpRight size={20}/>
        </button>)}
      </div>)}
    </div>
    <div id="toolkit-detail" className="skill-readout" aria-live="polite" aria-atomic="true">
      <span className="readout-state">{item.level}</span><h3>{item.name}</h3><p>{item.detail}</p>
      <h4 className="skill-topics-label">Conceitos relacionados</h4>
      <ul className="skill-topics">{item.topics.map(topic=><li key={topic}>{topic}</li>)}</ul>
      <span className="readout-caption">EXPERIÊNCIA, PRÁTICA E ESTUDOS IDENTIFICADOS.</span>
    </div>
  </div>
}
