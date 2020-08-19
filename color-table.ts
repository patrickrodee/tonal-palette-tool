import {LitElement, html, css, customElement, property} from 'lit-element';

import './color-grade';

enum ColorNames {
  BLUE = 'Blue',
  RED = 'Red',
  GREEN = 'Green',
  YELLOW = 'Yellow',
  GREY = 'Grey',
}

interface Scale {
  scale: ColorNames;
  grades: Grade[];
}

interface Grade {
  color: string;
  grade: number;
}

const seedValues: Scale[] = [
  {
    scale: ColorNames.BLUE,
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
    scale: ColorNames.RED,
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
    scale: ColorNames.GREEN,
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
    scale: ColorNames.YELLOW,
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
  {
    scale: ColorNames.GREY,
    grades: [
      {color: '#ffffff', grade: 0},
      {color: '#f2f2f2', grade: 5},
      {color: '#e3e3e3', grade: 10},
      {color: '#c7c7c7', grade: 20},
      {color: '#ababab', grade: 30},
      {color: '#8f8f8f', grade: 40},
      {color: '#757575', grade: 50},
      {color: '#5e5e5e', grade: 60},
      {color: '#474747', grade: 70},
      {color: '#303030', grade: 80},
      {color: '#1f1f1f', grade: 90},
      {color: '#000000', grade: 100},
    ],
  },
];

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

  handlePopState = (event: PopStateEvent) => {
    if (event.state) {
      this.table = event.state;
      return;
    }

    this.table = this.initTable();
  };

  constructor() {
    super();

    this.table = this.initTable();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', this.handlePopState);
  }

  disconnectedCallback() {
    super.connectedCallback();
    window.removeEventListener('popstate', this.handlePopState);
  }

  handleColorInput(event) {
    const {scale, grade, color} = event.detail;
    const {didUpdate, table} = this.updateValues(scale, grade, color);
    if (didUpdate) {
      this.table = table;
    }
  }

  handleColorChange(event) {
    const {scale, grade, color} = event.detail;
    const {table} = this.updateValues(scale, grade, color);
    this.table = table;
    window.history.pushState(table, null, `?config=${btoa(JSON.stringify(table))}`);
  }

  render() {
    return html`<div id="root" @color-change="${this.handleColorChange}" @color-input="${this.handleColorInput}">
      ${this.table.map(({scale, grades}) => {
        return html`<color-grade .scale="${scale}" .grades="${grades}"></color-grade>`;
      })}
    </div>`;
  }

  private updateValues(scale, grade, color) {
    const table = JSON.parse(JSON.stringify(this.table));
    for (const seed of table) {
      if (seed.scale === scale) {
        for (const g of seed.grades) {
          if (g.grade === grade) {
            g.color = color;
            return {
              didUpdate: true,
              table,
            };
          }
        }
      }
    }
    return {
      didUpdate: false,
      table,
    };
  }

  private addUnloadedScales(scales: Scale[], names: ColorNames[]): Scale[] {
    const out = [...scales];
    for (const name of names) {
      const hasScale = scales.find((grade) => grade.scale === name) !== undefined;
      if (!hasScale) {
        const scale = seedValues.find((grade) => grade.scale === name);
        if (scale) {
          out.push(scale);
        }
      }
    }
    return out;
  }

  private initTable() {
    const urlParams = new URLSearchParams(window.location.search);
    const config = urlParams.get('config');
    if (config && config.length > 0) {
      const out = JSON.parse(atob(config));
      return this.addUnloadedScales(out, [
        ColorNames.GREY,
      ]);
    }

    return seedValues;
  }
}