import { JSDOM } from 'jsdom';

export const context = new JSDOM();
export const window: Window = context.window;
export const document: Document = window.document;
