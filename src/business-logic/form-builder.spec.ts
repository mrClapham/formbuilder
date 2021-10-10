import { formBuilder, findValueInObjectArray } from './form-builder';
import { EFormType, IFormElement } from '../interfaces/IFormElement';
describe('findValueInObjectArray', () => {
    const arr = [
        { id: 1 }, { id: 2 }
    ]
    const { result, index } = findValueInObjectArray(arr, 'id', 1);
    expect(result).toEqual(arr[0])
    expect(result).toBe(arr[0])
    expect(index).toEqual(0)
})


describe('formBuilder', () => {
    it('Should allow a new instance to be created with default data', () => {
        const onSubmit = (element: IFormElement[]): boolean => {
            return false
        }
        const { addElement, removeElement, elements } = formBuilder.create([], onSubmit)
        expect(typeof addElement).toBe('function')
        expect(typeof removeElement).toBe('function')
        expect(elements.length).toBe(0)
    })
    it('Should initialise with passed arguments', () => {
        const element0: IFormElement = {
            name: 'Zero',
            id: 0,
            type: EFormType.text,
            label: 'Label 0',
            value: null,
            placeholder: 'Type here 0'
        }

        const element1: IFormElement = {
            name: 'One',
            id: 1,
            type: EFormType.text,
            label: 'Label 1',
            value: null,
            placeholder: 'Type here 1'
        }

        const submissionFunction = (e: IFormElement[]): boolean => false

        const { onSubmit, elements } = formBuilder.create([element0, element1], submissionFunction)
        expect(onSubmit).toBe(submissionFunction);
        expect(elements).toContain(element0)
        expect(elements).toContain(element1)
        expect(elements.length).toBe(2)

    })

    it('Should allow an item to be added ', () => {
        const element0: IFormElement = {
            name: 'New',
            id: 0,
            type: EFormType.text,
            label: 'Label 0',
            value: null,
            placeholder: 'Type here 0'
        }


        const form = formBuilder.create()
        form.addElement(element0)
        form.addElement(element0)
        expect(form.elements.length).toBe(2)
        expect(form.elements.map(d => d.id)).toEqual([1, 2])
    })

    it('Should allow elements to be removed', () => {
        const element0: IFormElement = {
            name: 'New',
            id: 0,
            type: EFormType.text,
            label: 'Label 0',
            value: null,
            placeholder: 'Type here 0'
        }


        const form = formBuilder.create()
        form.addElement(element0)
        form.addElement(element0)
        form.addElement(element0)
        form.addElement(element0)
        form.addElement(element0)
        form.removeElement(3)
        expect(form.elements.length).toBe(4)
        expect(form.elements.map(d => d.id)).toEqual([1, 2, 4, 5])
    })

})