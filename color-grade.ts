import {LitElement, html, css, customElement, property} from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

import './color-picker';

@customElement('color-grade')
class ColorGrade extends LitElement {
  static get styles() {
    return css`
      #root {
        display: flex;
        flex-direction: column;
      }

      #scale {
        font-family: monospace;
        font-size: 1.5rem;
        background: white;
        border-bottom: 1px solid #333;
        text-align: center;
      }
    `;
  }

  @property({type: Array})
  grades = [];

  @property({type: String})
  scale = '';

  render() {
    return html`<div id="root">
      <span id="scale">${this.scale}</span>
      ${this.grades.map(({color, grade}) => {
        return html`<color-picker .color="${color}" .grade="${grade}" .scale="${this.scale}"></color-picker>`;
      })}
    </div>`;
  }
}