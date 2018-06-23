/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { JSDOM } from 'jsdom';

export const context = new JSDOM();
export const window: Window = context.window;
export const document: Document = window.document;
