import { ISection } from '../pages'

interface IOutputComponentProps {
  sections: ISection[]
}

// const formatValue = (val: string | boolean | number){
//     if(typeof val === "string" || typeof val === "number"){
//         return val
//     }
//     return val.toString()
// }

const shouldDisplay = (
  val: string | number | string[] | boolean | undefined
): boolean => {
  if (typeof val === 'object') {
    if (val.hasOwnProperty('length')) {
      if (val.length === 0) return false
      return true
    }
  }
  return !!val
}

const determineSectionName = (section: ISection): string => {
  if (!section.custom_name) {
    return `[${section.section_name}]`
  } else {
    return `[${section.section_name} ${section.custom_name}]`
  }
}

const OutputComponent: React.FC<IOutputComponentProps> = ({ sections }) => {
  return (
    <div className='bg-gray-400 font-mono'>
      {sections.map((section, index) => (
        <div key={`section-${section.section_name}`}>
          <div>{determineSectionName(section)}</div>
          <div>
            {Object.entries(section.fields).map(([key, val]) =>
              shouldDisplay(val) ? (
                <div key={`section-${section.section_name}-field-${key}`}>
                  {key} = {val.toString()}
                </div>
              ) : null
            )}
          </div>
          <br />
        </div>
      ))}
    </div>
  )
}

export default OutputComponent
