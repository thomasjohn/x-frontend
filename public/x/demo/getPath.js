export default function getPathToNode(node) {
  let path = [];
  let inside = false

  while (node) {
    if (node.id === 'test_area') {
      inside = true
      break
    }
    
    let tagName = node.nodeName.toLowerCase();

    let siblingIndex = 1;
    let sibling = node.previousElementSibling;
    while (sibling) {
      if (sibling.nodeName.toLowerCase() === tagName) {
        siblingIndex++;
      }
      sibling = sibling.previousElementSibling;
    }

    if (siblingIndex > 1) {
      tagName += `:nth-of-type(${siblingIndex})`;
    }

    path.unshift(tagName);
    node = node.parentNode;
  }

  if (!inside)
    return '-'

  return path.length ? `${path.join(' > ')}` : null;
}