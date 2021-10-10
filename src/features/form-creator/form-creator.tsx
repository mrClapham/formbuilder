import React, { useState } from 'react';

import { IFormElement } from '../../interfaces/IFormElement';
import { formBuilder } from '../../business-logic/form-builder';

import styles from './form-creator.module.css';

import { IFormElementBase, EFormType } from '../../interfaces/IFormElement';

const formElementBase: IFormElementBase = {
    name: 'Add name',
    type: EFormType.text,
    label: 'Add label',
    value: null,
    placeholder: ''
}

const onSubmit = (e: HTMLFormElement | null) => {
    const elements = e?.querySelectorAll('input')
    if(elements){
        const allElements = Array.from(elements).map(({name, value})=> ({name, value}))
        console.log(JSON.stringify(allElements))
    }

    return true
}
const form = formBuilder.create([], onSubmit);


export const FormCreator = () => {
    const formRef = React.useRef<HTMLFormElement>(null);

    const [formState, setFormState] = useState(form)
    const [cellState, setCellState] = useState(formElementBase)

    const addField = (type: EFormType = EFormType.text, name: string = 'untitled', label: string = 'label', placeholder: string = "placeholder"): void => {
        const element: IFormElementBase = { name, value:null, type, label, placeholder }
        form.addElement(element)
        setFormState({ ...form })
    }
    const addTextField = () => {
        const {name,  label, placeholder} = cellState
        addField(EFormType.text, name, label, placeholder)
    }

    const addCheckbox = () => {
        const {name, label, placeholder} = cellState
        addField(EFormType.check, name, label, placeholder)
    }

    const removeElement = (id: number) => {
        console.log(id)
        form.removeElement(id);
        setFormState({ ...form })
    }
    const makeTextField = (d: IFormElement) => {
        const { name, label, placeholder, id, type } = d;

        return (<div className={styles.formCreatorFormCell} key={`${id}_${name}`} >
            <label htmlFor={name}>{label} : 
            <input type={type} id={name} name={name} placeholder={placeholder}/>
            <button onClick={(e) => {
                e.preventDefault()
                removeElement(id)
            }}>Delete</button >
            </label>
        </div>)
    }
const onCellPropsChanged = (e: React.ChangeEvent<HTMLInputElement>): void =>{
    const {target: {name, value}} = e;
        console.log(value)
        const newVal: IFormElementBase = {...cellState}
        // This would have been nice but, you know, Typescript ==> newVal[name] = value
        switch(name){
            case 'name' :
                newVal.name = String(value)
            break;
            case 'type' :
                newVal.type = value as EFormType
            break;
            case 'label' :
                newVal.label = String(value)
            break;
            case 'value' :
                newVal.value = String(value) // not using this - it could be used to hard set the value
            break;
            case 'placeholder' :
                newVal.placeholder = String(value) 
            break;
            default :
                // nothing here
                console.log(newVal)
            break;

        }
        setCellState(newVal)

}

    const createForm = (data: IFormElement[]) => {
        return data.map(d => {
            switch(d.type){
                case  'text' :
                    return makeTextField(d)
                case 'checkbox' :
                    return makeTextField(d)
                default :
                    return makeTextField(d)
                }
        })
    }
    return (
<>
<div className={styles.formCreatorFormContainer}>
        <div className={styles.formCreatorFormContainerColumn}>
            <h1>Form builder</h1>
            <label htmlFor='name'>Name:
            <input name='name' type='text' value={cellState.name} onChange={(e)=> onCellPropsChanged(e)}/>
            </label>

            <label htmlFor='label'>Label:
            <input name='label' type='text' value={cellState.label} onChange={(e)=> onCellPropsChanged(e)}/>
            </label>

            <label htmlFor='label'>Placeholder:
            <input name='placeholder' type='text' value={cellState.placeholder} onChange={(e)=> onCellPropsChanged(e)}/>
            </label>

            <label htmlFor='label'>Type:
            <input name='placeholder' type='text' value={cellState.type} onChange={(e)=> onCellPropsChanged(e)}/>
            </label>

            <button onClick={() => addTextField()}>Add a text field</button>
            <button onClick={() => addCheckbox()}>Add a checkbox</button>

        </div>
        <div className={styles.formCreatorFormContainerColumn}>
            <form ref={formRef} id='mainForm'>
                {createForm(formState.elements)}
                <button type='submit' onClick={(e) => {
                    e.preventDefault()
                    form.onSubmit(document.querySelector('#mainForm') as HTMLFormElement)
                }}>Submit</button>
            </form>


            <p>{JSON.stringify(formState.elements)}</p>
            {/* <button type='submit'>text</button> */}
        </div>
        </div>
        </>
    );
}
