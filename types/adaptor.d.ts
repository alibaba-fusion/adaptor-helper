import Types from "./types";
declare type TObject = {
    [key: string]: any;
};
export interface IOption {
    label: string;
    value: string;
}
export interface IProp {
    name: string;
    label?: string;
    type: Types;
    options?: IOption[];
    default?: any;
}
export interface IDataOption {
    group?: boolean;
    hover?: boolean;
    active?: boolean;
    disable?: boolean;
    icon?: boolean;
    generate?: boolean;
    default: string;
}
export interface IEditorConfig {
    props: IProp[];
    nodes: IProp[];
    data?: IDataOption;
}
export interface IContenOption {
    name: string;
    label?: string;
    options: Array<string | IOption>;
    default?: string;
}
export interface IContentConfig {
    options: IContenOption[];
    transform(props: TObject, options: TObject): TObject;
}
export interface IDemoNode {
    adaptor: string;
    props: TObject;
}
export interface IDemo {
    id: string;
    background?: string;
    height?: number;
    node: IDemoNode;
}
export interface IAdaptor {
    name: string;
    shape?: Array<string | IOption>;
    editor(shape: string): IEditorConfig;
    adaptor(props: TObject): any;
    content(shape: string): IContentConfig;
    demoOptions(demo: IDemo): IDemo;
}
export declare const normalizeAdaptor: (adaptor: IAdaptor) => IAdaptor;
export declare const getDefaultProps: (adaptor: IAdaptor, shape: string) => TObject;
export declare const findProp: (name: string, props?: IProp[]) => IProp | undefined;
export declare const findOptionLabel: (value: string, name: string, props?: IProp[]) => string;
export declare const uuid: () => string;
export declare const generateDemos: (adaptor: IAdaptor) => IDemo[];
export {};
