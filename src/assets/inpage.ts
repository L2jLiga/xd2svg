function get(id: number | string): HTMLElement {
  return document.getElementById('tGs3czb_' + id);
}

function gridlyRules(): HTMLElement {
  let rulesElement: HTMLElement = get('gridlyRules');

  if (rulesElement) {
    return rulesElement;
  }

  rulesElement = create('div', 'root', 'gridlyRules');

  document.body.appendChild(rulesElement);

  return rulesElement;
}

function fixedPos(x: number): () => number {
  return (): number => {
    return x;
  };
}

function elementPos(element: Element, label: string): () => number {
  return (): number => {
    const elementRect: ClientRect | DOMRect = element.getBoundingClientRect();
    const computedStylesForElement = computeStyles(element);

    switch (label) {
      case 'left':
        return elementRect.left;
      case 'right':
        return elementRect.left + elementRect.width;
      case 'top':
        return elementRect.top;
      case 'bottom':
        return elementRect.top + elementRect.height;
      case 'inside-border-left':
        return elementRect.left + getStyleValue('border-left-width');
      case 'inside-border-right':
        return elementRect.left + elementRect.width - getStyleValue('border-right-width');
      case 'content-left':
        return elementRect.left + getStyleValue('border-left-width') + getStyleValue('padding-left');
      case 'content-right':
        return elementRect.left + elementRect.width - getStyleValue('border-right-width') - getStyleValue('padding-right');
      case 'inside-border-top':
        return elementRect.top + getStyleValue('border-top-width');
      case 'inside-border-bottom':
        return elementRect.top + elementRect.height - getStyleValue('border-bottom-width');
      case 'content-top':
        return elementRect.top + getStyleValue('border-top-width') + getStyleValue('padding-top');
      case 'content-bottom':
        return elementRect.top + elementRect.height - getStyleValue('border-bottom-width') - getStyleValue('padding-bottom');
      case 'baseline':
        return getBaselineY(element);
    }

    function getStyleValue(style: string): number {
      return parseInt(computedStylesForElement[style]);
    }
  };
}

interface CachedStyles {
  e: Element;
  s?: CSSStyleDeclaration;
}

const cachedStyles: CachedStyles = {e: null};

function computeStyles(element: Element): CSSStyleDeclaration {
  if (element !== cachedStyles.e) {
    cachedStyles.e = element;
    cachedStyles.s = window.getComputedStyle(element);
  }

  return cachedStyles.s;
}

function getBaselineY(target: Element): number {
  // Don't do this inside TABLE or other dangerous places! Only where
  // there is already some text.
  if (!target.hasChildNodes() || /test/i.test(target.tagName)) {
    return null;
  }
  const children: NodeListOf<Node & ChildNode> = target.childNodes;
  let child: Node = null;
  for (let i = 0; i < children.length; ++i) {
    if (children[i].nodeType === Node.TEXT_NODE) {
      child = children[i];
      break;
    }
  }
  if (child === null) {
    return null;
  }

  const txt: HTMLSpanElement = document.createElement('span');

  txt.style.setProperty('display', 'inline-block', 'important');
  txt.style.setProperty('position', 'static', 'important');
  txt.style.setProperty('height', '1px', 'important');
  txt.style.setProperty('width', '1px', 'important');
  txt.style.setProperty('padding', '0', 'important');
  txt.style.setProperty('margin', '0', 'important');

  target.insertBefore(txt, child);

  const y: number = txt.getBoundingClientRect().top + 1;

  target.removeChild(txt);

  return y;
}

function nearest(element: Element, candidates: any[], value: number): any[] {
  let dist: number = state.snap ? 10 : 1;
  let label: string = '';
  let best: () => number = fixedPos(value);

  for (const candidate in candidates) {
    if (!candidates[candidate]) {
      continue;
    }

    const name: string = candidates[candidate];
    const pos: () => number = elementPos(element, name);
    const p: number = pos();

    if (p != null) {
      const d = Math.abs(value - p);

      if (d < dist) {
        dist = d;
        label = name;
        best = pos;
      }
    }
  }
  return [label, best];
}

/**
 * Create tag with specific classNames
 * @param {string} tag
 * @param {string[]} classNames
 * @param {string} id
 * @return {Element}
 */
function create(tag: string, classNames: string, id?: string): HTMLElement {
  const element = document.createElement(tag);
  const classes = classNames ? classNames.split(' ') : [];

  for (const className in classes) {
    if (classes[className]) {
      classes[className] = 'tGs3czb_' + classes[className];
    }
  }

  element.className = 'tGs3czb ' + classes.join(' ');

  if (id) {
    element.id = 'tGs3czb_' + id;
  }

  return element;
}

interface Rule {
  setPosition: (pos, label?) => void;
  refresh: () => void;
  copyPosition: (rule) => void;
  remove: () => void;
  isVertical: boolean;
  loupeRule: Element;
  rule: Element;
  pos?: () => number;
  poslabel: Element;
  difflabel: Element;
  id: string | number;
  text?: string;
}

function newRule(isVertical: boolean, temp: string = ''): Rule {
  const ruleElement: Element = create('div', 'rule ' + (isVertical ? 'v' : 'h') + (temp ? ' ' + temp : ''));
  const loupeRuleElement: Element = create('div', 'louperule ' + (isVertical ? 'v' : 'h') + (temp ? ' ' + temp : ''));
  const labelElement: Element = create('div', 'label');
  const poslabelElement: Element = create('div', 'poslabel');
  const difflabelElement: Element = create('div', 'difflabel');

  labelElement.appendChild(poslabelElement);
  labelElement.appendChild(difflabelElement);
  poslabelElement.textContent = '';
  difflabelElement.textContent = '';
  ruleElement.appendChild(labelElement);
  gridlyRules().appendChild(ruleElement);
  loupe.rules.appendChild(loupeRuleElement);
  const r = {
    setPosition(pos, label) {
      this.pos = pos;
      this.text = label;
      this.refresh();
    },
    refresh() {
      const p = this.pos();
      this.p = p;
      if (this.isVertical) {
        this.rule.style.left = p + 'px';
        this.loupeRule.style.left = loupeState.zoom * p + 'px';
      } else {
        this.rule.style.top = p + 'px';
        this.loupeRule.style.top = loupeState.zoom * p + 'px';
      }
      const o = state.origin[this.isVertical ? 1 : 0]();
      this.poslabel.textContent = this.text + ' ' + (p - o);
      this.difflabel.textContent = '';
    },
    copyPosition(rule) {
      this.setPosition(rule.pos, rule.text);
    },
    remove() {
      gridlyRules().removeChild(this.rule);
      loupe.rules.removeChild(this.loupeRule);
    },
    difflabel: difflabelElement,
    id: null,
    isVertical,
    loupeRule: loupeRuleElement,
    poslabel: poslabelElement,
    rule: ruleElement,
  };
  r.setPosition(fixedPos(-100), '');
  return r;
}

interface Loupe {
  div: HTMLElement;
  image: HTMLElement;
  rules: HTMLElement;
}

function makeLoupe(): Loupe {
  const divElement: HTMLElement = create('div', 'loupe', 'loupe');
  const imageElement: HTMLElement = create('div', 'loupeimg');
  const rulesElement: HTMLElement = create('div', 'louperules');

  divElement.appendChild(imageElement);
  divElement.appendChild(rulesElement);

  gridlyRules().appendChild(divElement);

  return {div: divElement, image: imageElement, rules: rulesElement};
}

function highlightElement(e: HTMLElement): void {
  const eb = elementBox;
  const cb = elementContentBox;
  const styles = computeStyles(e);
  const btw = parseInt(styles['border-top-width']);
  const brw = parseInt(styles['border-right-width']);
  const bbw = parseInt(styles['border-bottom-width']);
  const blw = parseInt(styles['border-left-width']);
  const pt = parseInt(styles['padding-top']);
  const pr = parseInt(styles['padding-right']);
  const pb = parseInt(styles['padding-bottom']);
  const pl = parseInt(styles['padding-left']);
  const top = elementPos(e, 'top')();
  const right = elementPos(e, 'right')();
  const bottom = elementPos(e, 'bottom')();
  const left = elementPos(e, 'left')();
  eb.style.top = top + 'px';
  eb.style.left = left + 'px';
  eb.style.width = right - left - blw - brw + 'px';
  eb.style.height = bottom - top - btw - bbw + 'px';
  eb.style['border-top-width'] = btw + 'px';
  eb.style['border-right-width'] = brw + 'px';
  eb.style['border-bottom-width'] = bbw + 'px';
  eb.style['border-left-width'] = blw + 'px';
  cb.style.top = top + btw + pt + 'px';
  cb.style.left = left + blw + pl + 'px';
  cb.style.width = right - left - pl - pr - blw - brw + 'px';
  cb.style.height = bottom - top - pt - pb - btw - bbw + 'px';
}

const loupeState = {
  on: false,
  url: null,
  x: 0,
  y: 0,
  zoom: 8.0,
};

interface State {
  snap: boolean;
  baseline: boolean;
  origin: Array<() => number>;
  colspec: string;
  rowspec: string;
  pointerEvents: boolean;
  help: boolean;
}

const state: State = {
  baseline: false,
  colspec: '16:grey 28:transparent 16:pink 28:transparent',
  help: true,
  origin: [fixedPos(0), fixedPos(0)],
  pointerEvents: false,
  rowspec: '70 70 3000:transparent',
  snap: true,
};

function askColumns(): void {
  const answer = window.prompt(
    'Input column spec as a series of widths, optionally colored: example: "16:transparent 28:#888"', state.colspec);
  if (answer) {
    state.colspec = answer;
    setColumns(columnsBox, answer, false);
  } else {
    setColumns(columnsBox, '', false);
  }
}

function askRows(): void {
  const answer = window.prompt(
    'Input row spec as a series of heights, optionally colored: example: "100:red 32:blue"', state.rowspec);
  if (answer) {
    state.rowspec = answer;
    setColumns(rowsBox, answer, true);
  } else {
    setColumns(rowsBox, '', true);
  }
}

function setColumns(box: HTMLElement, spec: string, horizontal: boolean): void {
  while (box.childNodes.length) {
    box.removeChild(box.firstChild);
  }
  if (!spec) {
    return;
  }
  const widths: string[] | number[] = spec.split(' ');
  const colors = [];
  for (let i = 0; i < widths.length; i++) {
    const s = widths[i].split(':');
    widths[i] = parseInt(s[0]) as any;
    if (s.length > 1) {
      colors[i] = s[1];
    } else {
      colors[i] = ['transparent', 'black'][i % 2];
    }
  }
  let total = 0;
  let count = 0;
  const limit = 3000;
  while (total < limit && count < 100) {
    const i = count % widths.length;
    const col = create('div', horizontal ? 'gridrow' : 'gridcol');
    col.style.background = colors[i];
    if (horizontal) {
      col.style.height = widths[i] + 'px';
    } else {
      col.style.width = widths[i] + 'px';
    }
    box.appendChild(col);
    total += widths[i] as any;
    count++;
  }
  refreshRules();
  // Deal with origin issues.
  if (loupeState.on) {
    // Refresh loupe if on.
    loupeState.on = false;
    toggleLoupe();
  }
}

/**
 * Toogle baseline
 */
function toggleBaseline() {
  state.baseline = !state.baseline;
}

/**
 * Toggle snap
 */
function toggleSnap() {
  state.snap = !state.snap;
}

/**
 * Toggle loupe
 */
function toggleLoupe() {
  if (loupeState.on) {
    loupe.div.style.display = 'none';
    loupeState.on = false;
    return;
  }

  // Hide all rules (but not grid) while grabbing image for loupe.
  gridlyRules().style.display = 'block';
  loupeState.on = true;
}

/**
 * Update loupe
 * @param {number} x
 * @param {number} y
 */
function updateLoupe(x, y) {
  loupeState.x = x;
  loupeState.y = y;
  if (loupeState.on) {
    loupeShow();
  }
}

/**
 * Loupe show
 */
function loupeShow() {
  const zoom = loupeState.zoom;
  loupe.rules.style.left = (200 - zoom * loupeState.x) + 'px';
  loupe.rules.style.top = (200 - zoom * loupeState.y) + 'px';
  loupe.image.style['background-image'] =
    'url(' + loupeState.url + ')';
  loupe.image.style['background-position'] =
    (200 / zoom - loupeState.x) + 'px ' + (200 / zoom - loupeState.y) + 'px';
  loupe.div.style.top = loupeState.y + 'px';
  loupe.div.style.left = loupeState.x + 'px';
}

const mouseListener = {
  handleEvent(e) {
    if (!tapeActive) {
      return;
    }
    if (!state.pointerEvents) {
      e.stopPropagation();
      e.preventDefault();
    }
    const t = e.target;
    const nearestX = nearest(
      t,
      ['left', 'right', 'inside-border-left', 'inside-border-right', 'content-left', 'content-right'],
      e.clientX);
    const nearestY = nearest(
      t,
      ['top', 'bottom', 'inside-border-top', 'inside-border-bottom', 'content-top', 'content-bottom', 'baseline'],
      e.clientY);
    tempVrule.setPosition(nearestX[1], t.tagName + ' ' + nearestX[0]);
    tempHrule.setPosition(nearestY[1], t.tagName + ' ' + nearestY[0]);

    if (state.baseline) {
      const baseline = getBaselineY(t);
      if (baseline != null) {
        baselineGrid.style.display = 'block';
        baselineGrid.style['-webkit-background-size'] =
          '0 ' + computeStyles(t)['line-height'];
        baselineGrid.style['background-position'] = '0 ' + baseline + 'px';
      } else {
        baselineGrid.style.display = 'none';
      }
    } else {
      baselineGrid.style.display = 'none';
    }
    highlightElement(t);
    refreshRules();
    updateLoupe(e.clientX, e.clientY);
    infoBox.textContent = '<' + t.tagName + '>';
  },
};

/**
 * Refresh rules
 */
function refreshRules() {
  rules.h = {};
  rules.v = {};
  originHrule.refresh();
  originVrule.refresh();
  tempHrule.refresh();
  tempVrule.refresh();
  for (const id in rules.all) {
    if (!rules.all[id]) {
      continue;
    }

    const r = rules.all[id];
    r.refresh();
    if (r.isVertical) {
      rules.v[r.p] = r;
    } else {
      rules.h[r.p] = r;
    }
  }
  diffLabels(originHrule, tempHrule, rules.h);
  diffLabels(originVrule, tempVrule, rules.v);
  // Origin may have moved, so update columns.
  const ox = state.origin[1]();
  const oy = state.origin[0]();
  columnsBox.style.left = ox + 'px';
  rowsBox.style.top = oy + 'px';
}

/**
 * Compare rules
 * @param {{}} rule1
 * @param {{}} rule2
 * @param {{}[]} rulesList
 */
function diffLabels(rule1, rule2, rulesList) {
  const keys = [rule1.p, rule2.p];
  for (const key in rulesList) {
    if (!rulesList[key]) {
      continue;
    }

    keys[keys.length] = rulesList[key].p;
  }
  keys.sort((x, y) => x - y);
  let prev = -1;

  for (let i = 0; i < keys.length; i++) {
    const pos = keys[i];
    if (pos < 0) {
      continue;
    } else if (prev < 0) {
      prev = pos;
    } else if (pos !== prev) {
      const diff = '+' + (pos - prev);
      if (rule1.p === pos) {
        rule1.difflabel.textContent = diff;
      }
      if (rule2.p === pos) {
        rule2.difflabel.textContent = diff;
      }
      if (rulesList[pos]) {
        rulesList[pos].difflabel.textContent = diff;
      }
    }
    if (i < keys.length - 1 && keys[i + 1] !== pos) {
      prev = pos;
    }
  }
}

/**
 * Set origin
 */
function setOrigin() {
  state.origin[0] = tempHrule.pos;
  state.origin[1] = tempVrule.pos;
  originVrule.copyPosition(tempVrule);
  originHrule.copyPosition(tempHrule);
  refreshRules();
}

/**
 * Clear rules
 */
function clearRules() {
  for (const p in rules.h) {
    if (!rules.h[p]) {
      continue;
    }

    const r = rules.h[p];
    r.remove();
  }
  for (const p in rules.v) {
    if (!rules.v[p]) {
      continue;
    }

    const r = rules.v[p];
    r.remove();
  }
  originHrule.setPosition(fixedPos(-100));
  originVrule.setPosition(fixedPos(-100));
  state.origin = [fixedPos(0), fixedPos(0)];
  rules.all = [];
  rules.h = [];
  rules.v = [];
  refreshRules();
}

/**
 * Toggle pointer
 */
function togglePointer() {
  state.pointerEvents = !state.pointerEvents;
}

/**
 * Toggle help
 */
function toggleHelp() {
  state.help = !state.help;
  helpBox.style.display = state.help ? 'block' : 'none';
}

const keyListener = {
  handleEvent(event) {
    if (event.keyCode === 27) {
      toggleActive();
      event.stopPropagation();
      event.preventDefault();

      return;
    }
    if (!tapeActive) {
      return;
    }

    const keys = {
      192: toggleLoupe,
      76: toggleLoupe,
      66: toggleBaseline,
      83: toggleSnap,
      86: dropVertical,
      72: dropHorizontal,
      79: setOrigin,
      88: clearRules,
      67: askColumns,
      82: askRows,
      80: togglePointer,
      32: toggleHelp,
      191: toggleHelp,
    };
    if (keys[event.keyCode]) {
      keys[event.keyCode]();
      event.stopPropagation();
      event.preventDefault();
    } else {
      console.log('keydown ' + event.keyCode);
    }
  },
};

// TODO: Refactor it with requestAnimationFrame

let refreshTimeoutId = -1;
const refreshListener = {
  handleEvent(e) {
    if (refreshTimeoutId === -1) {
      refreshTimeoutId = window.setTimeout(() => {
        refreshTimeoutId = -1;
        refreshRules();
      }, 100);
    }
  },
};

/**
 * Listen
 */
function listen() {
  document.documentElement.addEventListener('mouseover', mouseListener, true);
  document.documentElement.addEventListener('mousemove', mouseListener, true);
  document.documentElement.addEventListener('click', mouseListener, true);
  document.documentElement.addEventListener('keydown', keyListener, true);
  window.addEventListener('scroll', refreshListener, true);
  window.addEventListener('resize', refreshListener, true);
}

/**
 * Toggle active
 */
function toggleActive() {
  tapeActive = !tapeActive;
  if (tapeActive) {
    gridlyRules().style.display = 'block';
    columnsBox.style.display = 'block';
    rowsBox.style.display = 'block';
    if (loupeState.on) {
      loupeState.on = false;
      toggleLoupe();
    }
  } else {
    gridlyRules().style.display = 'none';
    columnsBox.style.display = 'none';
    rowsBox.style.display = 'none';
  }
}

/**
 * Drop horizontal
 */
function dropHorizontal() {
  const p = tempHrule.pos();
  if (rules.h[p]) {
    const r = rules.h[p];
    r.remove();
    delete rules.all[r.id];
    delete rules.h[p];
  } else {
    const r = newRule(false);
    r.copyPosition(tempHrule);
    r.id = (rules.nextId++);
    rules.all[r.id] = r;
    rules.h[p] = r;
  }
}

/**
 * Drop vertical
 */
function dropVertical() {
  const p = tempVrule.pos();
  if (rules.v[p]) {
    const r = rules.v[p];
    r.remove();
    delete rules.all[r.id];
    delete rules.v[p];
  } else {
    const r = newRule(true);
    r.copyPosition(tempVrule);
    r.id = (rules.nextId++);
    rules.all[r.id] = r;
    rules.v[p] = r;
  }
}

gridlyRules();

const infoBox = create('div', 'infobox');
gridlyRules().appendChild(infoBox);

const rules = {nextId: 0, all: {}, h: {}, v: {}};

const loupe = makeLoupe();
const tempHrule = newRule(false, 'temp');
const tempVrule = newRule(true, 'temp');
const originHrule = newRule(false, 'origin');
const originVrule = newRule(true, 'origin');
const baselineGrid = create('div', 'baseline_grid');
const elementBox = create('div', 'box');
const elementContentBox = create('div', 'content_box');
gridlyRules().appendChild(baselineGrid);
gridlyRules().appendChild(elementBox);
gridlyRules().appendChild(elementContentBox);

const columnsBox = create('div', 'columns');
const rowsBox = create('div', 'rows');
document.body.appendChild(columnsBox);
document.body.appendChild(rowsBox);

const helpBox = create('div', 'help');
gridlyRules().appendChild(helpBox);
helpBox.textContent =
  '       TAPE CONTROLS\n' +
  '\n' +
  '      ESC — toggle on/off\n' +
  '  SPC / ? — toggle help\n' +
  '        H — place horizontal rule\n' +
  '        V – place vertical rule\n' +
  '        X – remove all rules\n' +
  '        O — set origin\n' +
  '        S — toggle snap-to\n' +
  '        B — show/hide baseline grid\n' +
  '        C – set column grid\n' +
  '        R – set row grid\n' +
  '        P – enable/disable pointer events\n' +
  '    L / ` — show/hide loupe \n' +
  '';

let tapeActive = true;
listen();
