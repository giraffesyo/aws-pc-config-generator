import type { ISection, ISectionState } from '../pages'

interface IOutputComponentProps {
  sections: ISectionState[]
}

// const formatValue = (val: string | boolean | number){
//     if(typeof val === "string" || typeof val === "number"){
//         return val
//     }
//     return val.toString()
// }

const shouldDisplay = (
  val: string | number | string[] | boolean | null
): boolean => {
  if (typeof val === 'object') {
    if (val && val.hasOwnProperty('length')) {
      if (val.length === 0) return false
      return true
    }
  } else if (typeof val === 'boolean') {
    return true
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
  //   const sectionsArr: ISection[] = [
  //     sections.required.global,
  //     sections.required.aws,
  //     sections.required.cluster,
  //   ]
  return (
    <div className='bg-gray-400 font-mono fixed w-1/4 overflow-y-scroll h-3/4'>
      {sections.map((section, index) => (
        <div key={`section-${section.section_name}`}>
          <div className='lowercase'>{determineSectionName(section)}</div>
          <div>
            {Object.entries(section.fields).map(([key, val]) =>
              shouldDisplay(val.value) ? (
                <div key={`section-${section.section_name}-field-${key}`}>
                  <span className='lowercase'>{key}</span> ={' '}
                  {val.value?.toString()}
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
