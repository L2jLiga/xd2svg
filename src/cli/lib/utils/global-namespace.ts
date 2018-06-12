const jsdom = require('jsdom');

export const context = new jsdom.JSDOM();
export const window: Window = context.window;
export const document: Document = window.document;
