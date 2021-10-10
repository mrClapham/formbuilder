import React, { useState, useEffect } from 'react';

import { IFormElement } from '../../interfaces/IFormElement';
import { formBuilder } from '../../business-logic/form-builder';

import styles from './form-creator.module.css';

import { IFormElementBase, EFormType } from '../../interfaces/IFormElement';

const trash = <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
const check = <svg  fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
const textIcon = <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>


const formElementBase: IFormElementBase = {
    name: 'Add name',
    type: EFormType.text,
    label: 'Add label',
    value: null,
    placeholder: 'Add placeholder'
}


const form = formBuilder.create([]);

export const FormCreator = () => {

    const formRef = React.useRef<HTMLFormElement>(null);

    const [formState, setFormState] = useState(form)
    const [cellState, setCellState] = useState(formElementBase)
    const [formOutput, setFormOutput] = useState('The form has noot been submitted')

   useEffect(()=>{
    const onSubmit = (e: HTMLFormElement | null) => {
        const elements = e?.querySelectorAll('input')
        if(elements){
            const allElements = Array.from(elements).map(({name, value, checked, type})=> {return type === 'checkbox' ?  {name, checked, type} :  {name, value, type}  })
            const cleanString = JSON.stringify(allElements)
            setFormOutput(cleanString.split("\"").join(''))
        }
        return true
    }
        form.onSubmit = onSubmit
    },[])


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
        form.removeElement(id);
        setFormState({ ...form })
    }
    const makeTextField = (d: IFormElement) => {
        const { name, label, placeholder, id, type } = d;
        return (<div className={styles.formCreatorFormCell} key={`${id}_${name}`} >
            <label htmlFor={name}><span className={styles.labelPafdding}>{label} : </span>
            <input type={type} id={name} name={name} placeholder={placeholder}/>
            <div className={styles.deleteButton} role="button" tabIndex = {-1} onClick={(e) => {
                e.preventDefault()
                removeElement(id)
            }}> {trash} </div >
            </label>
        </div>)
    }

const onCellPropsChanged = (e: React.ChangeEvent<HTMLInputElement>): void =>{
    const {target: {name, value}} = e;
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
            <p>To create a form field add the name, label text and optional placeholder text (if choosing a text field).</p>
            <p>Then click on the type of field you would like to add, text or checkbox.</p>
            <label htmlFor='name'><span className={styles.labelPafdding}>Name:</span>
            <input name='name' type='text' value={cellState.name} onChange={(e)=> onCellPropsChanged(e)}/>
            </label>

            <label htmlFor='label'><span className={styles.labelPafdding}>Label:</span>
            <input name='label' type='text' value={cellState.label} onChange={(e)=> onCellPropsChanged(e)}/>
            </label>

            <label htmlFor='label'><span className={styles.labelPafdding}>Placeholder:</span>
            <input name='placeholder' type='text' value={cellState.placeholder} onChange={(e)=> onCellPropsChanged(e)}/>
            </label>

        <label>
        <span className={styles.labelPafdding}>Add field</span>
            <button onClick={() => addTextField()}><span className={styles.icon}> {textIcon}</span> Add a text field</button>
            <button onClick={() => addCheckbox()}> {check} Add a checkbox</button>
        </label>
        </div>
        <div className={styles.formCreatorFormContainerColumn}>
            <form ref={formRef} id='mainForm'>
                {createForm(formState.elements)}
                <button type='submit' onClick={(e) => {
                    e.preventDefault()
                    form.onSubmit(document.querySelector('#mainForm') as HTMLFormElement)
                }}>Submit</button>
            </form>

            <div className={styles.formSubmit} ><code>Submitted value: {JSON.stringify(formOutput)}</code></div>
            {/* <button type='submit'>text</button> */}
        </div>
        </div>
        </>
    );
}
