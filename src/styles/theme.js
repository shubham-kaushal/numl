import { composeThemeName, parseThemeAttr, RGB_COLORS, THEME_PROPS_LIST } from '../themes';
import { BASE_COLOR, SPECIAL_BASE_COLOR } from './color';
import { isNoValue } from '../helpers';

/**
 * Apply theme to the element by providing specific custom properties.
 * @param {String} val - Theme name.
 * @param {Object} defaults - Element default attribute values.
 * @returns {*}
 */
export default function themeAttr(val, defaults = {}) {
  if (val == null) val = '';

  if (isNoValue(val)) {
    return [];
  }

  const theme = parseThemeAttr(val);
  const themeName = composeThemeName(theme);

  const styles = [THEME_PROPS_LIST.reduce((map, prop) => {
    if (themeName === 'main') {
      map[`--nu-${prop}`] = `var(--nu-${themeName}-${prop})`;
    } else {
      map[`--nu-${prop}`] = `var(--nu-${themeName}-${prop}, var(--nu-main-${prop}))`;
    }

    return map;
  }, {
    '--nu-local-border-color': 'var(--nu-border-color)',
    '--nu-local-mark-color': 'var(--nu-mark-color)',
    '--nu-local-shadow-color': 'var(--nu-shadow-color)',
  })];

  // rgb colors
  RGB_COLORS.forEach(clr => {
    styles[0][`--nu-${clr}-color-rgb`] = `var(--nu-${themeName}-${clr}-color-rgb, var(--nu-main-${clr}-color-rgb))`;
  });

  styles.push({
    $suffix: ':not([color])',
    '--nu-local-text-color': 'initial',
  }, {
    $suffix: ':not([color]):not([special])',
    color: BASE_COLOR,
  }, {
    $suffix: ':not([color])[special]',
    color: SPECIAL_BASE_COLOR,
  });

  return styles;
}
