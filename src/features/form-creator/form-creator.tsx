import React, { useState } from 'react';

import { IFormElement } from '../../interfaces/IFormElement';
import { formBuilder } from '../../business-logic/form-builder';

import styles from './form-creator.module.css';

import { IFormElementBase, EFormType } from '../../interfaces/IFormElement';

const formElementBase: IFormElementBase = {
    name: '',
    type: EFormType.text,
    label: '',
    value: null,
    placeholder: ''
}

const onSubmit = (e: IFormElement[]) => {
    console.log(e)
    return true
}
const form = formBuilder.create([], onSubmit);


export const FormCreator = () => {

const [formState, setFormState] = useState(form)

const addField = (type: EFormType = EFormType.text, name: string = 'untitled', value: number | string | null = null,  label: string = 'label', placeholder: string= "placeholder"):void => {
    const element: IFormElementBase = {name, value, type, label, placeholder}
    form.addElement(element)
    setFormState({...form})
}
const addTextField = (name: string, value: number | string | null , label: string, placeholder: string) => {
    addField(EFormType.text, name, value, label, placeholder)
}
const removeElement = (id: number) => {
    console.log(id)
    form.removeElement(id);
    setFormState({...form})
}
const makeTextField = (d: IFormElement) => {
    const { name, value="", label, placeholder, id, type} = d;

    return   (<div className='form-creator-form-cell' key = {`${id}_${name}`} >
                <label htmlFor={name}>{label} : </label>
                <input type={type} id={name} name={name} />
                <button onClick={ (e)=> {
                    e.preventDefault()
                    removeElement(id)}}>X</button>
            </div>)
}
const createForm = (data: IFormElement[]) => {
    return data.map(d=>{
        return makeTextField(d)
    })
}

console.log('fs: ',formState)
  return (
    <div>
        <form>

{createForm(formState.elements)}
<button type='submit' onClick={(e)=>{
    e.preventDefault()
    form.onSubmit(form.elements)
    }}>Submit</button>
            </form>
    <p>{JSON.stringify(formState.elements)}</p>
    <button onClick={ () => addTextField('nameone', 'hello', 'label', 'hold') }>text</button>
    </div>
  );
}
