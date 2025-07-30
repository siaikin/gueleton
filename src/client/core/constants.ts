import type * as CSS from 'csstype'

export const CopiedCssProperties: (keyof CSS.StandardPropertiesHyphen)[] = [
  // position
  ...['position', 'z-index', 'top', 'left', 'right', 'bottom'],
  ...['text-align', 'float'],
  'display',
  ...['width', 'max-width', 'min-width'],
  ...['height', 'max-height', 'min-height'],
  ...['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
  ...['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
  // flex 布局
  ...['flex-direction', 'align-items', 'justify-content', 'flex-wrap', 'gap', 'flex', 'flex-shrink', 'flex-grow', 'flex-basis', 'flex-flow', 'align-content', 'align-self'],
  // grid 布局
  ...['grid-template-columns', 'grid-template-rows', 'grid-template-areas', 'column-gap', 'row-gap', 'grid-column-start', 'grid-column-end', 'grid-row-start', 'grid-row-end', 'grid-auto-columns', 'grid-auto-rows', 'grid-auto-flow', 'grid-template'],
  // transform 相关属性
  ...['transform', 'transform-origin', 'transform-style', 'transform-box'],
  // border
  ...['border-radius', 'border-bottom-right-radius', 'border-bottom-left-radius', 'border-top-right-radius', 'border-top-left-radius', 'border-end-start-radius', 'border-end-end-radius', 'border-start-start-radius', 'border-start-end-radius'],
  // inline
  ...['vertical-align'],
] as const

export const Tags = {
  /**
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements#text_content
   */
  Boneable: [
    ...['area', 'audio', 'img', 'track', 'video'],
    ...['embed', 'fencedframe', 'iframe', 'object'],
    ...['svg'],
    ...['canvas'],
    // Forms
    ...['button', 'input', 'meter', 'progress', 'select', 'textarea'],
  ],
  /**
   * @see https://developer.mozilla.org/en-US/docs/Glossary/Void_element
   */
  Void: ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'],
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements
   */
  Inline: ['a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 'rb', 'rp', 'rt', 'rtc', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'],
  /**
   * 作为 bone 时, 将占满父元素
   */
  AutoFill: ['td', 'th']
}
