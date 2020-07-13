import {LitElement, html, css, customElement, property} from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

import {luminance, isColorValid, hexToHslString} from './contrast';

@customElement('color-picker')
class ColorPicker extends LitElement {
  static get styles() {
    return css`
      #root {
        background: var(--input-color);
        border-width: 2px;
        border-style: solid;
        border-color: transparent;
        width: 156px;
        height: 96px;
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #root:focus-within {
        border-color: var(--accessible-color);
      }

      #input {
        opacity: 0;
        position: absolute;
      }

      #label {
        font-family: monospace;
        color: var(--accessible-color);
        text-align: center;
      }

      #tooltip {
        background: black;
        color: white;
        font-family: monospace;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(100%, -50%);
        z-index: 1;
        padding: 0.25rem;
        max-width: 160px;
        opacity: 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        transition: 150ms opacity linear;
        pointer-events: none;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        line-height: 1;
        vertical-align: middle;
      }

      #tooltip:before {
        content: '';
        position: absolute;
        left: -12px;
        display: inline-block;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 12px 12px 12px 0;
        border-color: transparent black transparent transparent;
      }

      #warning {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 24px;
        height: 24px;
        fill: var(--accessible-color);
      }

      #root:hover #tooltip {
        opacity: 1;
        pointer-events: auto;
      }
    `;
  }

  @property({type: String})
  color = '#000000';

  @property({type: String})
  scale = '';

  @property({type: String})
  grade = -1;

  handleInput(event: InputEvent) {
    const evt = new CustomEvent('color-input', {
      detail: {
        scale: this.scale,
        grade: this.grade,
        color: (event.target as HTMLInputElement).value,
      },
      bubbles: true, 
      composed: true,
    });
    this.dispatchEvent(evt);
  }

  handleChange(event: InputEvent) {
    const evt = new CustomEvent('color-change', {
      detail: {
        scale: this.scale,
        grade: this.grade,
        color: (event.target as HTMLInputElement).value,
      },
      bubbles: true, 
      composed: true,
    });
    this.dispatchEvent(evt);
  }

  render() {
    const lum = luminance(this.color);
    const {passes, message} = isColorValid(this.color, this.grade);
    return html`<label id="root" style=${styleMap({
        '--input-color': this.color,
        '--accessible-color': lum.raw <= 0.175 ? 'white' : 'black',
      })}>
      <input id="input" type="color" value="${this.color}" @input="${this.handleInput}" @change="${this.handleChange}">
      <span id="label">Lum: ${lum.legible}<br>${this.color}<br>${hexToHslString(this.color)}</span>
      ${passes ? '' : html`<svg id="warning" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`}
      <span id="tooltip">${this.scale} ${this.grade}: ${message}</span>
    </label>`;
  }
}