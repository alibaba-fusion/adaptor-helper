import { normalizeAdaptor, generateDemos, getDefaultProps, findProp, findOptionLabel } from '../adaptor';
import Types from '../types';

const getButtonProps = (props, state) => {
  return {
    type: props.level,
    loading: state === 'active',
    block: props.block,
    size: props.size,
    disabled: state === 'disabled',
    active: state === 'hover',
  };
};


const LEVELS_MAP = {
  normal: ['normal', 'primary', 'secondary', 'warning', 'light', 'dark'],
  text: ['normal', 'primary'],
  list: ['normal', 'primary', 'secondary'],
};

const SIZES_MAP = {
  normal: ['large', 'medium', 'small'],
  text: ['medium', 'small'],
  list: ['medium'],
};

const Button = {
  name: 'Button',
  shape: ['normal', 'text', 'list'], // default ['normal']
  editor(shape) {
    return {
      props: [{
        name: 'level',
        type: Types.enum,
        options: LEVELS_MAP[shape],
        default: 'normal',
      }, {
        name: 'size',
        type: Types.enum,
        options: SIZES_MAP[shape],
        default: 'medium',
      }, {
        name: 'block',
        type: Types.bool,
      }].filter(({ name }) => {
        return shape === 'normal' || name !== 'block';
      }),
      data: {
        icon: true,
        disable: true,
        active: true,
        hover: true,
        default: 'Hello',
      },
    };
  },
  content(shape) {
    const options = [
      {
        name: 'icon',
        options: ['none', 'left', 'right'],
        default: 'none',
      },
    ];

    if (shape !== 'text') {
      options.push({
        name: 'group',
        options: ['yes', 'no'],
        default: 'no',
      });
    }

    return {
      options,
      transform(props, { icon, group }) {
        const p = {
          ...props,
        };

        if (icon === 'left') {
          p.data = hasStateMark(p.data) ? `${p.data.substring(0, 1)}[arrow-left]${p.data.substring(1)}` : `[arrow-left]${p.data}`;
        } else if (icon === 'right') {
          p.data = `${p.data}[arrow-right]`;
        }

        if (group === 'yes') {
          p.data = [p.data, p.data].join('\n');
        }

        return p;
      },
    };
  },
  adaptor(props) {
    return null;
  },
  demoOptions(props) {
    let background = 'transparent';
    if (props.level === 'light') {
      background = '#EBECF0';
    } else if (props.level === 'dark') {
      background = '#000';
    }

    return {
      background,
    };
  },
};

describe('adaptor.js', () => {
  it('should be normalizeAdaptor', () => {
    const normalize = normalizeAdaptor(Button);

    expect(normalize).toMatchSnapshot();
    normalize.shape.forEach(({ value }) => {
      expect(normalize.editor(value)).toMatchSnapshot();
      expect(normalize.content(value)).toMatchSnapshot();
    });
  });

  it('should be getDefaultProps & finds', () => {
    const normalize = normalizeAdaptor(Button);
    const { props } = normalize.editor('normal');
    expect(getDefaultProps(normalize, 'normal')).toEqual({shape: 'normal', 'level': 'normal', 'size': 'medium', 'block': false, data: 'Hello'});

    expect(findProp('size', props).name).toBe('size');
    expect(findOptionLabel('medium', 'size', props)).toBe('Medium');
  });

  it('should be generateDemos', () => {
    expect(generateDemos(normalizeAdaptor(Button)).map(item => {
      delete item.id;
      return item;
    })).toMatchSnapshot();
  })
});
