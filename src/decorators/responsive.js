import NuDecorator from './decorator';
import { error } from '../helpers';

export default class NdResponsive extends NuDecorator {
  static get nuTag() {
    return 'nd-responsive';
  }

  static get nuAttrsList() {
    return ['points'];
  }

  constructor() {
    super();
  }

  nuMounted() {
    this.nuParse();
  }

  nuDecorate() {}

  nuParse() {
    const parent = this.parentNode;
    const context = this.nuParentContext;
    const points = this.getAttribute('points');

    if (this.nuParsedFor === points) return this.nuDecorate;

    this.nuParsedFor = points;

    if (!points) {
      return error(`points attribute is not specified`, this);
    }

    const tmpPoints = points.split(/\|/);

    const mediaPoints = tmpPoints.map((point, i) => {
      if (!i) {
        return `@media (min-width: ${point})`;
      }

      const prevPoint = tmpPoints[i - 1];

      return `@media (max-width: calc(${prevPoint} - 1px)) and (min-width: ${point})`;
    });

    mediaPoints.push(`@media (max-width: calc(${tmpPoints.slice(-1)[0]} - 1px))`);

    this.nuDecorate = function(styles) {
      return mediaPoints.map((point, i) => {
        let stls;

        if (styles[i]) {
          stls = styles[i];
        } else {
          for (let j = i - 1; j >=0; j--) {
            if (styles[j]) {
              stls = styles[j];
              break;
            }
          }
        }

        return `${point}{\n${stls || ''}\n}\n`;
      }).join('');
    };

    return this.nuDecorate;
  }
}