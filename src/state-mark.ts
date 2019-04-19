const STATE_MARK: any = {
  "-": "disabled",
  // tslint:disable-next-line:object-literal-sort-keys
  "*": "active",
  "~": "hover",
  "": "normal",
};

const STATE_PREFIX_MARK: any = {};

Object.keys(STATE_MARK).forEach((key: string) => {
  STATE_PREFIX_MARK[STATE_MARK[key]] = key;
});

export {
  STATE_MARK,
  STATE_PREFIX_MARK,
};
