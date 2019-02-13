import { CommonInput, CallbackObject } from './interfaces';

// @ts-ignore
const css = require('./index.css');

export class NumericInput implements CommonInput {
  private value: string | number | null = null;
  private text: string | undefined = '';
  private isValid: boolean = true;
  private host: Element | HTMLElement;
  private input: Element | HTMLElement;
  private subscriptions: CallbackObject[] = [];

  constructor(hostElement: string | HTMLElement | Element) {
    // @ts-ignore
    this.host = this.isElement(hostElement) ? hostElement : this.getElement(hostElement);
    this.init();
  }

  private init(): void {
    this.input = document.createElement('input');
    this.input.setAttribute('type', 'text');
    this.input.setAttribute('value', this.text);
    this.input.classList.add(css.input);

    this.host.appendChild(this.input);

    this.input.addEventListener('input', this.listener);
  }

  private evaluate(expression: string): number | null {
    return new Function('return ' + expression)();
  }

  private listener(event) {
    const changed: string[] = [];
    
    if (this.text !== event.target.value) {
      changed.push('text');
      this.text = event.target.value;
    }

    const value = this.evaluate(this.text);
    if (value !== this.value) {
      changed.push('value');
      this.value = value;
    }

    const isValid = /^\d*[.]{0,1}\d*$/.test(this.value.toString());
    if (isValid !== this.isValid) {
      changed.push('isValid');
      this.isValid = isValid;
    }

    this.subscriptions.forEach(function(cbObj: CallbackObject) {
      if (cbObj.type in changed) {
        cbObj.callback(this[cbObj.type]);
      }
    })
  }

  public textChanged(callback: any): void {
    this.subscriptions.push({
      type: 'text',
      callback
    });
  }

  public valueChanged(callback: any): void {
    this.subscriptions.push({
      type: 'value',
      callback
    });
  }

  public isValidChanged(callback: any): void {
    this.subscriptions.push({
      type: 'isValid',
      callback
    });
  }

  destroy(): void {
    this.input.removeEventListener('input', this.listener);
    this.host.removeChild(this.input);
    this.subscriptions.length = 0;
  }

  private isElement(element: Element | String | HTMLElement): boolean {
    return element instanceof Element || element instanceof HTMLDocument;
  }

  private getElement(element: any): HTMLElement | Element {
    if (typeof element === 'string') {
      let searchingElement = document.getElementById(element);
      if (this.isElement(searchingElement)) {
        return searchingElement;
      }
    }
    
    throw new Error('You have to pass in constructor existing DOM element or a valid id of the existing element!');
  }
}
