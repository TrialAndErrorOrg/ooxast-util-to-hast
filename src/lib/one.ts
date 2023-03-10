import { isElement } from 'xast-util-is-element'
import { Parent } from 'ooxast'
import { all } from './all'
import { Handle, H, HastContent, Node, Element } from './types'
import { own } from './util/own'
import { wrapText } from './util/wrap-text'

export function one(
  h: H,
  node: Node,
  parent: Parent
): HastContent | Array<HastContent> | void {
  let fn: Handle | undefined

  if (isElement(node)) {
    // if (node.attributes && node.attributes.datoHast === 'ignore') {
    //   return
    // }

    if (own.call(h.handlers, node.name.replace('w:', ''))) {
      fn = h.handlers[node.name.replace('w:', '')]
    }
  } else if (own.call(h.handlers, node.type)) {
    fn = h.handlers[node.type]
  }

  if (typeof fn === 'function') {
    return fn(h, node, parent)
  }

  return unknown(h, node)
}

function unknown(h: H, node: Node) {
  // @ts-expect-error: Looks like a literal.
  if (typeof node.value === 'string') {
    // @ts-expect-error: Looks like a literal.
    return h(node, 'text', wrapText(h, node.value))
  }

  return all(h, node)
}
