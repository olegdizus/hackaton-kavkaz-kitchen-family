function getTreeData() {

    var data = JSON.parse(rawData);
    return data;
}


function getTreeItemById(menuId) {
    var treeData = getTreeData();

    return getTreeSubitemById(treeData, menuId);
}

function getTreeSubitemById(menuNodes, menuId) {

    if (menuNodes != null) {
        for (var i = 0; i < menuNodes.length; i++) {
            if (menuNodes[i].id == menuId) {
                return menuNodes[i];
            } else {
                var result = getTreeSubitemById(menuNodes[i].nodes, menuId);

                if (result != null) {
                    return result;
                }
            }
        }
    }

    return null;
}


$(document).ready(function () {

    var selectors = {
        'tree': '#treeViewMenu',
        'input': '#input-select-node',
        'reset': '#btn-clear-search'
    };

    $(selectors.tree).treeview({ data: getTreeData() });

    $(selectors.tree).on('nodeSelected', function (event, node) {

        var menuId = node.id;
        $('#menuId').val(menuId);

        MenuItemClicked(menuId);
    });
    
    var lastPattern = '';

    function reset(tree) {
        tree.collapseAll();
        tree.enableAll();
    }

    function cancel(tree) {
        tree.enableAll();
        tree.clearSearch();
    }

    function collectUnrelated(nodes) {
        var unrelated = [];
        $.each(nodes, function (i, n) {
            if (!n.searchResult && !n.state.expanded) { 
                unrelated.push(n.nodeId);
            }
            if (!n.searchResult && n.nodes) {
                $.merge(unrelated, collectUnrelated(n.nodes));
            }
        });
        return unrelated;
    }

    var search = function (e) {
        var pattern = $(selectors.input).val();
        if (pattern === lastPattern) {
            return;
        }
        lastPattern = pattern;
        var tree = $(selectors.tree).treeview(true);
        if (pattern.length < 3) { 
            cancel(tree);
        } else {
            reset(tree);
            tree.search(pattern);
            var roots = tree.getSiblings(0);
            roots.push(tree.getNode(0));
            var unrelated = collectUnrelated(roots);
            tree.disableNode(unrelated, { silent: true });
        }
    };

    $(selectors.input).on('keyup', search);

    $(selectors.reset).on('click', function (e) {
        $(selectors.input).val('');
        var tree = $(selectors.tree).treeview(true);
        cancel(tree);
    });

});


