$(document).ready(function() {
    $('#cc').combobox({
        onSelect: function(rec) {
            switch (rec.value) {
                case 'gray':
                    $('#easyuiTheme').attr("href", "./plugin/jquery-easyui-1.5.2/themes/gray/easyui.css");
                    break;
                case 'metro':
                    $('#easyuiTheme').attr("href", "./plugin/jquery-easyui-1.5.2/themes/metro/easyui.css");
                    break;
                case 'blue':
                    $('#easyuiTheme').attr("href", "./plugin/jquery-easyui-1.5.2/themes/default/easyui.css");
                    break;
            }
        }
    })
});
