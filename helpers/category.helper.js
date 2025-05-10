
const CategoryTree = (Categories, itemParent = "") => {
    const tree = [];

    Categories.forEach((item) => {
        if (item.parent == itemParent) {
            const children = CategoryTree(Categories, item.id) // tree

            tree.push({
                id: item.id,
                name: item.name,
                children: children
            })
        }
    });

    return tree;

}
module.exports.CategoryTree = CategoryTree;