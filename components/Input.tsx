import React, { SetStateAction } from 'react'
import { ISection } from '../pages'

interface IInputComponentProps {
  sections: ISection[]
  setSections: React.Dispatch<SetStateAction<ISection[]>>
}

const InputComponent: React.FC<IInputComponentProps> = () => {
  return <div>Hello</div>
}

export default InputComponent
