/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { helpTemplate } from './help-template';
import { CachedStyles, Loupe, Rule, State } from './models';

function gridlyRules(): HTMLDivElement {
  let rulesElement = document.getElementById('tGs3czb_gridlyRules') as HTMLDivElement;

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

function elementPos(element: Element, label: string) {
  return () => {
    const sx: number = window.scrollX;
    const sy: number = window.scrollY;
    const elementBoundingRect = element.getBoundingClientRect();

    switch (label) {
      case 'left':
        return elementBoundingRect.left + sx;
      case 'right':
        return elementBoundingRect.left + elementBoundingRect.width + sx;
      case 'top':
        return elementBoundingRect.top + sy;
      case 'bottom':
        return elementBoundingRect.top + elementBoundingRect.height + sy;
    }

    const computedStylesForElement = computeStyles(element);
    const toInt = (k) => parseInt(computedStylesForElement[k]);

    switch (label) {
      case 'inside-border-left':
        return elementBoundingRect.left + toInt('border-left-width') + sx;
      case 'inside-border-right':
        return elementBoundingRect.left + elementBoundingRect.width - toInt('border-right-width') + sx;
      case 'content-left':
        return elementBoundingRect.left + toInt('border-left-width') + toInt('padding-left') + sx;
      case 'content-right':
        return elementBoundingRect.left + elementBoundingRect.width - toInt('border-right-width') - toInt('padding-right') + sx;
      case 'inside-border-top':
        return elementBoundingRect.top + toInt('border-top-width') + sy;
      case 'inside-border-bottom':
        return elementBoundingRect.top + elementBoundingRect.height - toInt('border-bottom-width') + sy;
      case 'content-top':
        return elementBoundingRect.top + toInt('border-top-width') + toInt('padding-top') + sy;
      case 'content-bottom':
        return elementBoundingRect.top + elementBoundingRect.height - toInt('border-bottom-width') - toInt('padding-bottom') + sy;
      case 'baseline':
        return getBaselineY(element) + sy;
    }
  };
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
  if (!target.hasChildNodes() || /TABLE/i.test(target.tagName)) {
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
  if (child == null) {
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

function nearest(snap: boolean, element: Element, candidates: string[], value: number): any[] {
  let dist: number = snap ? 10 : 1;
  let label: string = '';
  let best: () => number = fixedPos(value);

  if (element) {
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
  }

  return [label, best];
}

function create<K extends keyof HTMLElementTagNameMap>(tag: K, classNames: string = '', id?: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  const classes = classNames ? classNames.split(' ') : [];
  for (const i in classes) {
    if (!classes[i]) continue;

    classes[i] = 'tGs3czb_' + classes[i];
  }

  element.className = 'tGs3czb ' + classes.join(' ');

  if (id) {
    element.id = 'tGs3czb_' + id;
  }

  return element;
}

function newRule(isVertical: boolean, temp?: string): Rule {
  const ruleElement = create('div', 'rule ' + (isVertical ? 'v' : 'h') + (temp ? ' ' + temp : ''));
  const loupeRuleElement = create('div', 'louperule ' + (isVertical ? 'v' : 'h') + (temp ? ' ' + temp : ''));
  const labelElement = create('div', 'label');
  const poslabelElement = create('div', 'poslabel');
  const difflabelElement = create('div', 'difflabel');

  labelElement.appendChild(poslabelElement);
  labelElement.appendChild(difflabelElement);
  poslabelElement.textContent = '';
  difflabelElement.textContent = '';
  ruleElement.appendChild(labelElement);
  gridlyRules().appendChild(ruleElement);
  loupe.rules.appendChild(loupeRuleElement);

  const r: Rule = {
    setPosition(pos: () => number, label?: string): void {
      this.pos = pos;
      this.text = label;
      this.refresh();
    },
    refresh(): void {
      const p = this.pos();
      this.p = p;
      if (this.isVertical) {
        this.rule.style.left = p - window.scrollX + 'px';
        this.loupeRule.style.left = loupeState.zoom * (p - window.scrollX) + 'px';
      } else {
        this.rule.style.top = p - window.scrollY + 'px';
        this.loupeRule.style.top = loupeState.zoom * (p - window.scrollY) + 'px';
      }
      const o = state.origin[this.isVertical ? 1 : 0]();
      this.poslabel.textContent = this.text + ' ' + (p - o);
      this.difflabel.textContent = '';
    },
    copyPosition(rule): void {
      this.setPosition(rule.pos, rule.text);
    },
    remove(): void {
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

function makeLoupe(): Loupe {
  const loupeDiv = create('div', 'loupe', 'loupe') as HTMLDivElement;
  const loupeImage = create('img', 'loupeimg') as HTMLImageElement;
  const loupeRules = create('div', 'louperules') as HTMLDivElement;

  loupeDiv.appendChild(loupeImage);
  loupeDiv.appendChild(loupeRules);

  gridlyRules().appendChild(loupeDiv);

  return {div: loupeDiv, image: loupeImage, rules: loupeRules};
}

function highlightElement(element: Element): void {
  const eb = elementBox;
  const cb = elementContentBox;
  const styles = computeStyles(element);
  const btw = parseInt(styles['border-top-width']);
  const brw = parseInt(styles['border-right-width']);
  const bbw = parseInt(styles['border-bottom-width']);
  const blw = parseInt(styles['border-left-width']);
  const pt = parseInt(styles['padding-top']);
  const pr = parseInt(styles['padding-right']);
  const pb = parseInt(styles['padding-bottom']);
  const pl = parseInt(styles['padding-left']);
  const top = elementPos(element, 'top')();
  const right = elementPos(element, 'right')();
  const bottom = elementPos(element, 'bottom')();
  const left = elementPos(element, 'left')();
  eb.style.top = top - window.scrollY + 'px';
  eb.style.left = left - window.scrollX + 'px';
  eb.style.width = right - left - blw - brw + 'px';
  eb.style.height = bottom - top - btw - bbw + 'px';
  eb.style['border-top-width'] = btw + 'px';
  eb.style['border-right-width'] = brw + 'px';
  eb.style['border-bottom-width'] = bbw + 'px';
  eb.style['border-left-width'] = blw + 'px';
  cb.style.top = top - window.scrollY + btw + pt + 'px';
  cb.style.left = left - window.scrollX + blw + pl + 'px';
  cb.style.width = right - left - pl - pr - blw - brw + 'px';
  cb.style.height = bottom - top - pt - pb - btw - bbw + 'px';
}

const loupeState = {
  flipX: false,
  flipY: false,
  on: false,
  url: null,
  x: 0,
  y: 0,
  zoom: 8.0,
};

const state: State = {
  colspec: '16:grey 28:transparent 16:pink 28:transparent',
  help: true,
  origin: [fixedPos(0), fixedPos(0)],
  pointerEvents: false,
  rowspec: '70 70 3000:transparent',
  snap: true,
};

function askColumns() {
  const answer = window.prompt(
    'Input column spec as a series of widths, optionally colored: '
    + ' example: "16:transparent 28:#888"',
    state.colspec);
  if (answer) {
    state.colspec = answer;
    setColumns(columnsBox, answer, false);
  } else {
    setColumns(columnsBox, '', false);
  }
}

function askRows() {
  const answer = window.prompt(
    'Input row spec as a series of heights, optionally colored: '
    + ' example: "100:red 32:blue"',
    state.rowspec);
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
  const limit = 3000;  // Max browser width to go up to.
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

function toggleSnap() {
  state.snap = !state.snap;
}

function toggleLoupe() {
  if (loupeState.on) {
    loupe.div.style.display = 'none';
    loupeState.on = false;
    return;
  }
  // Hide all rules (but not grid) while grabbing image for loupe.
  gridlyRules().style.display = 'none';

  window.requestAnimationFrame(() => {
    gridlyRules().style.display = 'block';
    loupe.div.style.display = 'block';
    loupeState.on = true;
  });
}

function updateLoupe(x: number, y: number): void {
  loupeState.x = x;
  loupeState.y = y;
  const k: number = 280;

  if (x < k) {
    loupeState.flipX = false;
  } else if (x > window.innerWidth - k) {
    loupeState.flipX = true;
  }
  if (y < k) {
    loupeState.flipY = false;
  } else if (y > window.innerHeight - k) {
    loupeState.flipY = true;
  }
  if (!loupeState.on) {
    return;
  }
  loupeShow();
}

function loupeShow(): void {
  const zoom = loupeState.zoom;
  loupe.rules.style.height = zoom * loupe.height + 'px';
  loupe.rules.style.width = zoom * loupe.width + 'px';
  loupe.rules.style.left = (200 - zoom * loupeState.x) + 'px';
  loupe.rules.style.top = (200 - zoom * loupeState.y) + 'px';
  loupe.image.src = loupeState.url;
  loupe.image.style.height = zoom * loupe.height + 'px';
  loupe.image.style.width = zoom * loupe.width + 'px';
  loupe.image.style.left = (200 - zoom * loupeState.x) + 'px';
  loupe.image.style.top = (200 - zoom * loupeState.y) + 'px';
  loupe.div.style.top = loupeState.y - (loupeState.flipY ? 400 : 0) + 'px';
  loupe.div.style.left = loupeState.x - (loupeState.flipX ? 400 : 0) + 'px';
}

const mouseListener: EventListenerObject = {
  handleEvent(e: MouseEvent) {
    if (!tapeActive) {
      return;
    }
    if (!state.pointerEvents) {
      e.stopPropagation();
      e.preventDefault();
    }
    moveTo(state.snap, e.clientX, e.clientY, e.target as Element);
  },
};

function moveTo(snap: boolean, x: number, y: number, target: Element): void {
  const nearestX = nearest(
    snap,
    target,
    ['left', 'right', 'inside-border-left', 'inside-border-right',
      'content-left', 'content-right'],
    x + window.scrollX);
  const nearestY = nearest(
    snap,
    target,
    ['top', 'bottom', 'inside-border-top', 'inside-border-bottom',
      'content-top', 'content-bottom', 'baseline'],
    y + window.scrollY);
  tempVrule.setPosition(nearestX[1], target.tagName + ' ' + nearestX[0]);
  tempHrule.setPosition(nearestY[1], target.tagName + ' ' + nearestY[0]);

  highlightElement(target);
  refreshRules();
  const fromBottom = (window.innerHeight - y);
  if (fromBottom < 400 && x < 400) {
    helpBox.style.display = 'none';
  } else if (fromBottom > 450 || x > 450) {
    helpBox.style.display = state.help ? 'block' : 'none';
  }
  updateLoupe(x, y);
  infoBox.textContent = '<' + target.tagName + '>';
}

function refreshRules() {
  rules.h = {};
  rules.v = {};
  originHrule.refresh();
  originVrule.refresh();
  tempHrule.refresh();
  tempVrule.refresh();
  for (const id in rules.all) {
    if (!rules.all[id]) continue;

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

function diffLabels(rule1: Rule, rule2: Rule, rulesList: {[key: number]: Rule}) {
  const keys = [rule1.p, rule2.p];
  for (const key in rulesList) {
    if (!rulesList.hasOwnProperty(key)) {
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

function setOrigin(): void {
  state.origin[0] = tempHrule.pos;
  state.origin[1] = tempVrule.pos;
  originVrule.copyPosition(tempVrule);
  originHrule.copyPosition(tempHrule);
  refreshRules();
}

function clearRules(): void {
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

function togglePointer(): void {
  state.pointerEvents = !state.pointerEvents;
}

function toggleHelp(): void {
  state.help = !state.help;
  helpBox.style.display = state.help ? 'block' : 'none';
}

function nudgeBy(x: number, y: number) {
  return (e: KeyboardEvent) => {
    const speed = (e.altKey ? 16 : e.shiftKey ? 4 : 1);
    x = tempVrule.pos() + x * speed;
    y = tempHrule.pos() + y * speed;
    moveTo(false, x, y, document.elementFromPoint(x, y));
  };
}

function zoomIn(): void {
  if (!loupeState.on) {
    return;
  }
  loupeState.zoom = Math.min(16, loupeState.zoom + 1);
  loupeShow();
}

function zoomOut(): void {
  if (!loupeState.on) {
    return;
  }
  loupeState.zoom = Math.max(2, loupeState.zoom - 1);
  loupeShow();
}

const keyListener: EventListenerObject = {
  handleEvent(e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    if (e.keyCode === 27) {
      toggleActive();
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if (!tapeActive) {
      return;
    }
    const keys = {
      192: toggleLoupe,     // backquote
      76: toggleLoupe,     // L
      83: toggleSnap,      // S
      86: dropVertical,    // V
      72: dropHorizontal,  // H
      66: dropBoth,        // B
      79: setOrigin,       // O
      88: clearRules,      // X
      90: undoLast,        // Z
      67: askColumns,      // C
      82: askRows,         // R
      80: togglePointer,   // P
      32: toggleHelp,      // space
      191: toggleHelp,      // ?
      37: nudgeBy(-1, 0),  // left arrow
      38: nudgeBy(0, -1),  // up arrow
      39: nudgeBy(1, 0),   // right arrow
      40: nudgeBy(0, 1),   // down arrow
      187: zoomIn,          // plus
      189: zoomOut,         // minus
    };
    if (keys[e.keyCode]) {
      keys[e.keyCode](e);
    } else {
      console.log('keydown ' + e.keyCode);
    }
    e.stopPropagation();
    e.preventDefault();
  },
};

let refreshTimeoutId = -1;
const refreshListener: EventListenerObject = {
  handleEvent() {
    if (refreshTimeoutId !== -1) {
      window.clearTimeout(refreshTimeoutId);
    }

    // Looks bad to display loupe while scrolling.
    loupe.div.style.display = 'none';
    refreshTimeoutId = window.setTimeout(() => {
      refreshTimeoutId = -1;
      if (tapeActive) {
        showAll();
      }
    }, 200);
    refreshRules();
  },
};

function listen() {
  document.documentElement.addEventListener('mouseover', mouseListener, true);
  document.documentElement.addEventListener('mousemove', mouseListener, true);
  document.documentElement.addEventListener('click', mouseListener, true);
  document.documentElement.addEventListener('keydown', keyListener, true);
  window.addEventListener('scroll', refreshListener, true);
  window.addEventListener('resize', refreshListener, true);
}

function showAll() {
  gridlyRules().style.display = 'block';
  columnsBox.style.display = 'block';
  rowsBox.style.display = 'block';
  if (loupeState.on) {
    loupeState.on = false;
    toggleLoupe();
  }
}

function hideAll() {
  gridlyRules().style.display = 'none';
  columnsBox.style.display = 'none';
  rowsBox.style.display = 'none';
  loupe.div.style.display = 'none';
}

function toggleActive() {
  tapeActive = !tapeActive;
  if (tapeActive) {
    showAll();
  } else {
    hideAll();
  }
}

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

function dropBoth() {
  const x = tempVrule.pos();
  const y = tempHrule.pos();
  if (rules.v[x] && rules.h[y]) {
    // Remove both;
    dropVertical();
    dropHorizontal();
    return;
  }
  // Otherwise add whichever are missing.
  if (!rules.v[x]) {
    dropVertical();
  }
  if (!rules.v[y]) {
    dropHorizontal();
  }
}

function undoLast() {
  let m: number = -1;
  let r: Rule;
  for (const id in rules.all) {
    if (id && (id as any - m > 0)) {
      r = rules.all[id];
      m = id as any;
    }
  }
  if (r) {
    delete rules.all[r.id];
    if (r.isVertical) {
      delete rules.v[r.p];
    } else {
      delete rules.h[r.p];
    }
    r.remove();
  }
}

gridlyRules();

const infoBox = create('div', 'infobox');
gridlyRules().appendChild(infoBox);

// tslint:disable
const rules = {
  nextId: 0,
  all: {} as { [id: number]: Rule },
  h: {} as { [id: number]: Rule },
  v: {} as { [id: number]: Rule },
};
// tslint:enable

const loupe = makeLoupe();
const tempHrule = newRule(false, 'temp');
const tempVrule = newRule(true, 'temp');
const originHrule = newRule(false, 'origin');
const originVrule = newRule(true, 'origin');
const elementBox = create('div', 'box');
const elementContentBox = create('div', 'content_box');
gridlyRules().appendChild(elementBox);
gridlyRules().appendChild(elementContentBox);

const columnsBox = create('div', 'columns');
const rowsBox = create('div', 'rows');
document.body.appendChild(columnsBox);
document.body.appendChild(rowsBox);

const helpBox = create('div', 'help');
gridlyRules().appendChild(helpBox);
helpBox.textContent = helpTemplate;
helpBox.innerHTML = helpBox.innerHTML
  .replace(/\[([^\]]*)]/g, '<span class=tGs3czb_key>$1</span>')
  .replace(/{/g, '<div class=tGs3czb_vgroup>')
  .replace(/}/g, '</div>')
  .replace(/\n\n/g, '<br>');

let tapeActive = true;

listen();
