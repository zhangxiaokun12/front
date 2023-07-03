/**
 * 删除空的children对象，为了显示树形菜单时不显示多余的 + 号
 *
 * @author fengshuonan
 * @date 2022/5/20 18:33
 */
export function deleteEmptyChild(nodes) {
  for (let thisNode of nodes) {
    if (!thisNode) {
      continue;
    }
    if (thisNode.children && thisNode.children.length === 0) {
      delete thisNode.children;
    } else if (thisNode.children && thisNode.children.length > 0) {
      thisNode.children = deleteEmptyChild(thisNode.children);
    }
  }
  return nodes;
}
