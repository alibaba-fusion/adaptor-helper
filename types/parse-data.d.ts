export declare enum NodeType {
    divider = "divider",
    node = "node",
    comment = "comment"
}
export declare enum ContentType {
    text = "text",
    icon = "icon"
}
export interface IContent {
    type: ContentType;
    value: string;
}
export interface INode {
    type: NodeType;
    state: string;
    value: string | IContent[];
    children: INode[];
}
export interface IParseOption {
    parseContent: boolean;
}
export declare const parseData: (text: string, options?: IParseOption) => INode[];
export default parseData;
