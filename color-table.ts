import {LitElement, html, css, customElement, property} from 'lit-element';

import './color-grade';

interface Scale {
  scale: string;
  grades: Grade[];
}

interface Grade {
  color: string;
  grade: number;
}

let seedValues: Scale[] = [
  {
    scale: 'Blue',
    grades: [
      {color: '#ffffff', grade: 0},
      {color: '#ecf3fe', grade: 5},
      {color: '#d3e3fd', grade: 10},
      {color: '#a8c7fa', grade: 20},
      {color: '#7cacf8', grade: 30},
      {color: '#4c8df6', grade: 40},
      {color: '#1b6ef3', grade: 50},
      {color: '#0b57d0', grade: 60},
      {color: '#0842a0', grade: 70},
      {color: '#062e6f', grade: 80},
      {color: '#041e49', grade: 90},
      {color: '#000000', grade: 100},
    ],
  },
  {
    scale: 'Red',
    grades: [
      {color: '#ffffff', grade: 0},
      {color: '#fceeee', grade: 5},
      {color: '#f9dedc', grade: 10},
      {color: '#f2b8b5', grade: 20},
      {color: '#ec928e', grade: 30},
      {color: '#e46962', grade: 40},
      {color: '#dc362e', grade: 50},
      {color: '#b3261e', grade: 60},
      {color: '#8c1d18', grade: 70},
      {color: '#601410', grade: 80},
      {color: '#410e0b', grade: 90},
      {color: '#000000', grade: 100},
    ],
  },
  {
    scale: 'Green',
    grades: [
      {color: '#ffffff', grade: 0},
      {color: '#ddf9e5', grade: 5},
      {color: '#b6f2c8', grade: 10},
      {color: '#57e080', grade: 20},
      {color: '#24c655', grade: 30},
      {color: '#1ea446', grade: 40},
      {color: '#198639', grade: 50},
      {color: '#146c2e', grade: 60},
      {color: '#0f5223', grade: 70},
      {color: '#0a3818', grade: 80},
      {color: '#06220f', grade: 90},
      {color: '#000000', grade: 100},
    ],
  },
  {
    scale: 'Yellow',
    grades: [
      {color: '#ffffff', grade: 0},
      {color: '#fff0d1', grade: 5},
      {color: '#ffdf99', grade: 10},
      {color: '#ffbb29', grade: 20},
      {color: '#e69d00', grade: 30},
      {color: '#c28400', grade: 40},
      {color: '#9e6c00', grade: 50},
      {color: '#805700', grade: 60},
      {color: '#614200', grade: 70},
      {color: '#422d00', grade: 80},
      {color: '#291c00', grade: 90},
      {color: '#000000', grade: 100},
    ],
  },
];

const urlParams = new URLSearchParams(window.location.search);
const data = urlParams.get('data');
if (data) {
  seedValues = JSON.parse(atob(data));
}

@customElement('color-table')
class ColorTable extends LitElement {
  static get styles() {
    return css`
      #root {
        display: flex;
        border: 1px solid #333;
      }
    `;
  }

  @property({type: Array})
  table = seedValues;

  handleColorChange(event) {
    console.log(event);
  }

  render() {
    return html`<div id="root" @color-change="${this.handleColorChange}">
      ${this.table.map(({scale, grades}) => {
        return html`<color-grade .scale="${scale}" .grades="${grades}"></color-grade>`;
      })}
    </div>`;
  }
}