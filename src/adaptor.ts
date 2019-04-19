import { STATE_MARK, STATE_PREFIX_MARK } from "./state-mark";
import Types from "./types";
import { toLabelWord } from "./utils";

type TObject = { [key: string]: any };

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

const normalizeOptions = (options: Array<string | IOption> = []): IOption[] => {
  return options.filter((v: any) => !!v).map((item: any) => {
    const value = item.value || item;

    return {
      value,
      label: item.label || toLabelWord(value),
    };
  });
};

const normalizeProps = <T>(props: T[] = []): T[] => {
  return props.filter((v: any) => !!v).map((prop: any) => {
    return {
      ...prop,
      label: prop.label || toLabelWord(prop.name),
      options: normalizeOptions(prop.options),
    } as T;
  });
};

export const normalizeAdaptor = (adaptor: IAdaptor): IAdaptor => {
  if (!adaptor.name) {
    console.error("[error] muse be have name:");
    return adaptor;
  }

  let shape: IOption[];

  if (!adaptor.shape || !Array.isArray(adaptor.shape) || adaptor.shape.length < 1) {
    shape = [{ label: adaptor.name, value: "normal" }];
  } else {
    shape = adaptor.shape.filter((v: string | IOption) => !!v).map((item: any) => {
      const value: string = item.value || item;
      return {
        value,
        label: item.label || `${toLabelWord(value)} ${value === "normal" ? "" : adaptor.name}`,
      };
    });
  }

  const editor = (s: string): IEditorConfig => {
    const p: any = adaptor.editor ? adaptor.editor(s) : {};
    if (!p.props) {
      p.props = [];
    }
    if (!p.nodes) {
      p.nodes = [];
    }

    return {
      ...p,
      props: normalizeProps<IProp>(p.props),
      nodes: normalizeProps<IProp>(p.nodes),
    } as IEditorConfig;
  };

  const content = (s: string) => {
    const p: any = adaptor.content ? adaptor.content(s) : {};

    return {
      ...p,
      options: normalizeProps<IContenOption>(p.options),
    };
  };

  return {
    ...adaptor,
    shape,
    editor,
    content,
  } as IAdaptor;
};

export const getDefaultProps = (adaptor: IAdaptor, shape: string): TObject => {
  const p = adaptor.editor(shape);

  const props: { [key: string]: any } = {
    shape,
    data: (p.data && p.data.default) || "",
  };

  p.props.forEach((item: IProp) => {
    let { default: defaultValue } = item;
    if (defaultValue === undefined || defaultValue === null) {
      switch (item.type) {
        case Types.string:
          defaultValue = "";
          break;
        case Types.number:
          defaultValue = 0;
          break;
        case Types.bool:
          defaultValue = false;
          break;
        case Types.enum:
          defaultValue = item.options ? item.options[0].value : "";
          break;
        default:
          break;
      }
    }
    props[item.name] = defaultValue;
  });

  p.nodes.forEach(({ name, default: defaultValue }) => {
    props[name] = defaultValue;
  });

  return props;
};

export const findProp = (name: string, props: IProp[] = []): IProp | undefined => {
  return props.find((item: IProp) => item.name === name);
};

export const findOptionLabel = (value: string, name: string, props: IProp[] = []): string => {
  const prop = findProp(name, props);

  if (prop && prop.type === Types.enum) {
    const option = (prop.options || []).find((item) => item.value === value);
    return option ? option.label : value;
  }

  return "";
};

let index = 1;
const now = new Date().getTime();
export const uuid = () => (now + index++).toString(16);

const getStates = (dataOption: IDataOption = { default: "" }, props: IProp[] = []): string[] => {
  const stateMap: { [key: string]: boolean } = {
    normal: true,
    hover: !!dataOption.hover,
    active: !!dataOption.active,
    disabled: !!dataOption.disable,
  };

  let states: string[] | null = dataOption.generate === false ?
    null : Object.keys(stateMap).filter((key: string) => stateMap[key]);
  const stateProp = findProp("state", props);

  if (stateProp) {
    states = (stateProp.options || []).map(({ value }) => value);
  }

  return states || [];
};

export const generateDemos = (adaptor: IAdaptor): IDemo[] => {
  const demos: IDemo[] = [];
  (adaptor.shape as IOption[]).forEach(({ value } ) => {
    const editor = adaptor.editor(value);
    const sizeProp = findProp("size", editor.props);
    const stateProp = findProp("state", editor.props);
    const levelProp = findProp("level", editor.props);
    const states = getStates(editor.data, editor.props) || ["normal"];
    const sizes = sizeProp && sizeProp.options ? sizeProp.options.map(({ value: v }) => v) : ["medium"];
    const levels = levelProp && levelProp.options ? levelProp.options.map(({ value: v }) => v) : ["normal"];

    states.forEach((state: string) => {
      sizes.forEach((size) => {
        levels.forEach((level) => {
          const props: TObject = {
            ...getDefaultProps(adaptor, value),
          };

          if (sizeProp) {
            props.size = size;
          }

          if (levelProp) {
            props.level = level;
          }

          if (states.length > 1) {
            if (stateProp) {
              props.state = state;
            } else {
              if (props.data && STATE_MARK[props.data.substring(0, 1)]) {
                props.data = props.data.substring(1);
              }

              props.data = STATE_PREFIX_MARK[state] + props.data;
            }
          }

          const demo: IDemo = {
            id: uuid(),
            node: {
              adaptor: adaptor.name,
              props,
            },
          };

          demos.push({
            ...demo,
            ...(adaptor.demoOptions && adaptor.demoOptions(demo)),
          });
        });
      });
    });
  });
  return demos;
};
