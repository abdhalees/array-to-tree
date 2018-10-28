// dublicated tiers are ignored as they will be children
const getTiersHash = list =>
  list.reduce((acc, curr) => {
    if (!acc[curr.tier]) acc[curr.tier] = curr.start;
    return acc;
  }, {});

const getParent = (tiersHash, node) => {
  const path = node.tier.split('-');
  path.pop();
  if (path.length === 0) return null;
  const parentTier = path.join('-');
  if (tiersHash[parentTier]) return `${tiersHash[parentTier]}-${parentTier}`;
  return getParent(tiersHash, { start: node.start, tier: parentTier });
};

// create a hash with start-tiers as key and get parent for each node
const getHashTable = (list, tiersHash) =>
  list.reduce(
    (acc, curr) => {
      curr.parent = acc.tiers[curr.tier]
        ? `${tiersHash[curr.tier]}-${curr.tier}`
        : getParent(tiersHash, curr);
      curr.children = [];
      acc.hash[`${curr.start}-${curr.tier}`] = curr;
      acc.tiers[curr.tier] = 1;
      return acc;
    },
    { tiers: {}, hash: {} }
  ).hash;

module.exports = list => {
  // lowest starts will be at first top
  // in case of equal starts shortest tier will be before
  const sortedList = list.sort((a, b) => {
    if (a.start - b.start > 0) return 1;
    if (a.start - b.start < 0) return -1;
    if (a.start - b.start === 0) {
      const aTiers = a.tier.split('-').length;
      const bTiers = b.tier.split('-').length;
      return aTiers - bTiers;
    }
  });
  const tiersHash = getTiersHash(sortedList);
  const hash = getHashTable(sortedList, tiersHash);
  const tree = [];
  // if there is no parent then the node is a root
  // else it will pushed to it's parent children
  Object.keys(hash).forEach(node => {
    if (!hash[node].parent) tree.push(hash[node]);
    else {
      hash[hash[node].parent].children.push(hash[node]);
    }
    delete hash[node]['parent'];
  });

  return tree;
};
