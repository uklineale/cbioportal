/*
 * Copyright (c) 2015 Memorial Sloan-Kettering Cancer Center.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS
 * FOR A PARTICULAR PURPOSE. The software and documentation provided hereunder
 * is on an "as is" basis, and Memorial Sloan-Kettering Cancer Center has no
 * obligations to provide maintenance, support, updates, enhancements or
 * modifications. In no event shall Memorial Sloan-Kettering Cancer Center be
 * liable to any party for direct, indirect, special, incidental or
 * consequential damages, including lost profits, arising out of the use of this
 * software and its documentation, even if Memorial Sloan-Kettering Cancer
 * Center has been advised of the possibility of such damage.
 */

/*
 * This file is part of cBioPortal.
 *
 * cBioPortal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


var orTable = function() {
    
    var div_id, table_id, data;
    
    function configTable() {
        
        //Draw out the markdown of the datatable
        $("#" + table_id).append(
            "<thead style='font-size:70%;' >" +
            "<tr>" + 
            "<th>Gene</th>" +
            "<th>p-Value</th>" +
            "</tr>" +
            "</thead><tbody></tbody>"
        );

        //Configure the datatable with  jquery
        orTableInstance = $("#" + table_id).dataTable({
            "sDom": '<"H"f>t<"F"ip>',
            "bPaginate": true,
            "sPaginationType": "two_button",
            "bInfo": true,
            "bJQueryUI": true,
            "bAutoWidth": false,
            "aaData" : data,
            "aaSorting": [[1, 'desc']],
            "sScrollY": "400px",
            "bScrollCollapse": true,
            "oLanguage": {
                "sSearch": "Search Gene"
            },
            "bDeferRender": true,
            "iDisplayLength": 17
        });  
    }
    
    function convert_data(_json_data) {
        var table_arr = [];
        $.each(Object.keys(_json_data), function(_index, _key) {
            var _unit = [];
            _unit.push(_key);
            _unit.push(_json_data[_key]);
            table_arr.push(_unit);
        });  
        return table_arr;
    }
    
    return {
        init: function(_input_data, _div_id, _table_div, _table_id, _table_title) {
            
            div_id = _div_id;
            table_id = _table_id;
            data = convert_data(_input_data);
            
            $("#" + _table_div).empty();
            $("#" + _table_div).append("<span style='font-weight:bold;'>" + _table_title + "</span>");
            $("#" + _table_div).append("<table id='" + table_id + "' cellpadding='0' cellspacing='0' border='0' class='" + table_id + "_datatable_class'></table>"); 
            configTable();
        }
    };
    
};

var orSubTabView = function() {
    
    return {
        init: function(_div_id, _profile_list) {
            
            $.each(_profile_list, function(_index, _profile_obj) {
                
                 //avoid duplicated initiation
                var element = $("." + _profile_obj.STABLE_ID + orAnalysis.postfix.datatable_class);
                if (element.length === 0) {

                    var _table_div = _profile_obj.STABLE_ID + orAnalysis.postfix.datatable_div;
                    var _table_id = _profile_obj.STABLE_ID + orAnalysis.postfix.datatable_id;
                    $("#" + _div_id).append("<div id='" + _table_div + "' style='width: 400px; display:inline-block; padding: 10px;'></div>");
                    $("#" + _table_div).append("<img style='padding:20px;' src='images/ajax-loader.gif'><br>Calculating on " + _profile_obj.NAME + " ....");
                    
                    //init and get calculation result from the server
                    var param = new orAjaxParam(or_tab.getAlteredCaseList(), or_tab.getUnalteredCaseList(), _profile_obj.STABLE_ID);
                    var or_data = new orData();
                    or_data.init(param);
                    var or_table = new orTable();
                    or_data.get(or_table.init, _div_id, _table_div, _table_id, _profile_obj.NAME);
                    
                }
                
            });
            
        }
    };
};


