import produce from 'immer'
import React, { SetStateAction, useCallback } from 'react'
import { ISectionState, ISectionStateField } from '../pages'
import { FaTrash } from 'react-icons/fa'

interface IConfigFormComponentProps {
  sections: ISectionState[]
  deleteSection: (i: number) => void
  // setSections: Updater<ISection[]>
  setSections: React.Dispatch<SetStateAction<ISectionState[]>>
}

interface IFormFieldProps {
  name: string
  htmlFor?: string
}

const FormField: React.FC<IFormFieldProps> = ({ name, children, htmlFor }) => {
  return (
    <div className='flex flex-row p-1 items-center justify-between'>
      <label className='w-2/3' htmlFor={htmlFor}>
        {name}
      </label>
      {children}
    </div>
  )
}

interface IInputProps {
  id: string
  name: string
  field: ISectionStateField
  handleChange: React.ChangeEventHandler<HTMLInputElement>
  sectionIndex: number
}
const Input: React.FC<IInputProps> = ({
  name,
  field,
  handleChange,
  sectionIndex,
  id,
}) => {
  if (field.hasOwnProperty('allowed_values')) {
    return (
      <select
        id={id}
        className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 rounded-none rounded-r-md sm:text-sm border-gray-300'
        defaultValue={field.default?.toString()}
        data-section={sectionIndex}
        name={name}
        //@ts-ignore // FIXME: can't get the types to work here
        onChange={handleChange}
      >
        {field.allowed_values!.map((option, optionIndex) => (
          <option key={`select-${sectionIndex}-name-${optionIndex}`}>
            {option}
          </option>
        ))}
      </select>
    )
  } else if (typeof field.default === 'boolean') {
    return (
      <input
        id={id}
        className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 rounded-none rounded-r-md sm:text-sm border-gray-300'
        type='checkbox'
        value={name}
        defaultChecked={field.value as boolean}
        data-section={sectionIndex}
        name={name}
        onChange={handleChange}
      ></input>
    )
  } else if (typeof field.default === 'number') {
    return (
      <input
        id={id}
        className='focus:ring-indigo-500 focus:border-indigo-500 w-1/12 text-right self-end  rounded-none rounded-r-md sm:text-sm border-gray-300'
        value={field.value as number}
        type='number'
        data-section={sectionIndex}
        name={name}
        onChange={handleChange}
      />
    )
  } else {
    return (
      <input
        id={id}
        className='focus:ring-indigo-500 focus:border-indigo-500    rounded-none rounded-r-md sm:text-sm border-gray-300'
        //@ts-ignore
        //FIXME: Need to typeguard here, but its safe because we never stray from the type default has
        value={field.value || ''}
        name={name}
        data-section={sectionIndex}
        onChange={handleChange}
      />
    )
  }
}

const ConfigFormComponent: React.FC<IConfigFormComponentProps> = ({
  sections,
  setSections,
  deleteSection,
}) => {
  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      const property = e.target.name
      let newValue: string | boolean | number = e.target.value
      if (e.target.type === 'checkbox') {
        newValue = (e.target as HTMLInputElement).checked
      }

      const sectionIndex = parseInt(e.currentTarget.dataset.section as string)

      const nextSections = produce<ISectionState[]>(sections, (draft) => {
        draft[sectionIndex] = {
          ...draft[sectionIndex],
          fields: {
            ...draft[sectionIndex].fields,
            [property]: {
              ...draft[sectionIndex].fields[property],
              value: newValue,
            },
          },
        }
      })
      console.log(nextSections)
      setSections(nextSections)
    },
    [sections]
  )

  const updateCustomName = useCallback(
    (sectionIndex: number, newName: string) => {
      const newSections = produce(sections, (draft) => {
        draft[sectionIndex].custom_name = newName
      })
      setSections(newSections)
    },
    [sections]
  )

  return (
    <div className='flex flex-wrap justify-center'>
      {sections.map((section, sectionIndex) => (
        <form
          key={`section-${sectionIndex}`}
          className='bg-gray-100 p-4 rounded-lg w-1/2 m-5'
        >
          <div className='flex justify-between flex-row'>
            <h2 className='text-xl'>[{section.section_name}] section</h2>
            {section.required || (
              <FaTrash
                className='text-red-600 hover:opacity-80 cursor-pointer'
                onClick={() => deleteSection(sectionIndex)}
              ></FaTrash>
            )}
          </div>
          {section.hasOwnProperty('custom_name') && (
            <FormField
              htmlFor={`property-${sectionIndex}-name`}
              name='Section Name'
            >
              <input
                id={`property-${sectionIndex}-name`}
                className='focus:ring-indigo-500 focus:border-indigo-500 w-1/2 text-left   rounded-none rounded-r-md sm:text-sm border-gray-300'
                onChange={(e) => {
                  updateCustomName(sectionIndex, e.currentTarget.value)
                }}
              ></input>
            </FormField>
          )}
          {Object.entries(section.fields).map(([key, val], propertyIndex) => (
            <FormField
              htmlFor={`property-${sectionIndex}-${propertyIndex}`}
              key={`property-${sectionIndex}-${propertyIndex}`}
              name={key}
            >
              <Input
                id={`property-${sectionIndex}-${propertyIndex}`}
                sectionIndex={sectionIndex}
                handleChange={handleChange}
                field={val}
                name={key}
              ></Input>
            </FormField>
          ))}
        </form>
      ))}
    </div>
  )
}

export default ConfigFormComponent
