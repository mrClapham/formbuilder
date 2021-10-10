import { IForm, IFormElement, IFormElementBase } from '../interfaces/IFormElement';

const defaltSubmissionFunction = (e: IFormElement[]) => false

export const findValueInObjectArray = (arr: Partial<IFormElement>[], key: string, value: any): { result: Partial<IFormElement>, index: number } => {
    const result: Partial<IFormElement> = arr.find((e, index) => e[key as keyof typeof e] === value) as Partial<IFormElement>
    const index = result ? arr.indexOf(result) : -1
    return { result, index }
}

const defaultForm: IForm = {
    currentId: 0,
    getNextId() {
        this.currentId += 1
        return this.currentId
    },
    elements: [],
    onSubmit: defaltSubmissionFunction,
    addElement(e: IFormElementBase): IFormElement[] {
        const newElement: IFormElement = { ...e, id: this.getNextId() }
        const newState: IFormElement[] = [...this.elements, newElement]
        this.elements = newState
        return newState as IFormElement[]
    },
    removeElement(id: number): IFormElement[] {
        const { index } = findValueInObjectArray(this.elements, 'id', id)
        index >= 0 && this.elements.splice(index, 1)
        return this.elements
    }
}

export const formBuilder = {
    create(elements: IFormElement[] = [], onSubmit: (e: IFormElement[]) => boolean = defaltSubmissionFunction): IForm {
        return { ...defaultForm, onSubmit, elements }
    }
}
