export enum EFormType {
    text = "text",
    textarea = "textarea",
    radio = "radio",
    check = "checkbox",
    submit = "submit",
    button = "button"
}

export interface IForm {
    currentId: number;
    getNextId: () => number,
    onSubmit: (e: IFormElement[]) => boolean,
    elements: IFormElement[]
    addElement: (e: IFormElementBase) => IFormElement[],
    removeElement: (id: number) => IFormElement[]
}

export interface IFormElementBase {
    type: EFormType,
    label: string,
    value: string | number | boolean | null
    name: string,
    placeholder: string
}

export interface IFormElement extends IFormElementBase {
    id: number,
}