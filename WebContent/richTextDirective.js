"use strict";
var editorTemplate = "<div  ng-hide=\"editMode\">" +
	"{toolbar}" +
	"<div  style='resize:vertical;height:180px;overflow:auto' contentEditable='true'" +
	" class='form-control wysiwyg-textarea' ng-model='content'></div>' "+
	"<div ng-switch=\"editMode\" ng-click=\"editMode = !editMode\" class=\"toggle\"><span ng-switch-when=\"true\">wysiwyg</span><span ng-switch-default>source</span></div>" +
	"</div>" +
	"</div>";
var Wysiwig = angular.module("Wysiwig", ['colorpicker.module']);
Wysiwig.directive("richTextEditor", function($compile) {
    return {
    	restrict:"E",
    	replace:true,
    	scope: {
			content: '=ngModel', //this is our content which we want to edit
			editorApi: '=', //this is our api object
			config: '='
		},
        link: function(scope, element, attrs, ctrl) {
        	
        	scope.editMode = false;
        	//show all panels by default
			scope.toolbar = (scope.config && scope.config.toolbar)? scope.config.toolbar : [
				{ name: 'basicStyling', items: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'justifyleft', 'justifycenter', 'justifyright'] },
				{ name: 'paragraph', items: ['orderedList', 'unorderedList', 'outdent', 'indent'] },
				{ name: 'doers', items: ['removeFormatting', 'undo'] },
				{ name: 'colors', items: ['fontColor', 'backgroundColor'] },
				{ name: 'links', items: ['image','link', 'unlink'] },
				{ name: 'tools', items: ['print'] },
				{ name: 'styling', items: ['font', 'size'] }
			];
			scope.font = (scope.config && scope.config.font)?scope.config.font:[
	    		'Georgia',
	    		'Palatino Linotype',
	    		'Times New Roman',
	    		'Arial', 
	    		'Helvetica',
	    		'Arial Black',
	    		'Comic Sans MS',
	    		'Impact',
	    		'Lucida Sans Unicode',
	    		'Tahoma',
	    		'Trebuchet MS',
	    		'Verdana',
	    		'Courier New',
	    		'Lucida Console',
	    		'Helvetica Neue'
	    	];
		 scope.size=(scope.config && scope.config.size)?scope.config.size:['10px','13px','16px','18px','24px','32px','48px'];

			
			scope.panelButtons = {
					basicStyling:{type:"button",tabindex:"-1",unselectable:"on",justifyleft:{cssclass:"align-left"},justifycenter:{cssclass:"align-center"},justifyright:{cssclass:"align-right"}},
					paragraph:{type:"button",tabindex:"-1",unselectable:"on",orderedList:{cssclass:"list-ol"},unorderedList:{cssclass:"list-ul"}},
					doers:{type:"button",tabindex:"-1",unselectable:"on",removeFormatting:{cssclass:"eraser"},},
					colors:{type:"button",tabindex:"-1",unselectable:"on",fontColor:{color:true,name:"A" ,model:"fontColor",cssclass:"btn btn-default wysiwyg-colorpicker wysiwyg-fontcolor"},backgroundColor:{color:true,name:"B",model:"hiliteColor",cssclass:"btn btn-default wysiwyg-colorpicker wysiwyg-hiliteColor"}},
					links:{type:"button",tabindex:"-1",unselectable:"on"},
					tools:{type:"button",tabindex:"-1",unselectable:"on"},
					styling:{type:"select",tabindex:"-1",unselectable:"on"},
					};
			
			
			var usingFontAwesome = scope.config && scope.config.fontAwesome;
			
			function getButtonHtml(buttonGroupName,button) {
				var html ="";
				var stylesForButton = scope.panelButtons[buttonGroupName];
				if (stylesForButton.type == 'button') {
						html+="<"+stylesForButton.type;
						html += ' title= "'+ button + '"'+ " unselectable='on' tabindex='-1' ";
						html+=" class='btn btn-default";
						if(stylesForButton[button] && stylesForButton[button].color){
							html+=stylesForButton[button].cssclass+'\' colorpicker="rgba" colorpicker-position="bottom"';
						}else{
							html+="'";
						}
					if (button.backgroundPos && !usingFontAwesome) {
						html += 'style="background-position: ' + button.backgroundPos + '; position: relative;" ';
					}
						html += ' ng-class="{\'active\':isActive(\''+button+'\')}" ';
						var command = button;
						if (stylesForButton[button] && stylesForButton[button].color) {
							html += " ng-model='"+stylesForButton[button].model+"' ng-change='execCommand(\""+ command +"\")' ";
						}else{
						html += "ng-click='execCommand(\""+ command +"\")' ";
						}
					html += '>'; 
					if(stylesForButton[button] && stylesForButton[button].color){
						html +=stylesForButton[button].name;
					}else{
					html += '<i class="fa fa-' + (stylesForButton[button]!=null?stylesForButton[button].cssclass:button) + '"></i>';
					}
					if (button.inner) {
						html+= stylesForButton.inner;
					}
					html+="</"+stylesForButton.type+">";
				} else if (stylesForButton.type == 'select') {
					html+="<div class='btn-group btn-group-sm wysiwyg-btn-group-margin'>"
					html+="<"+stylesForButton.type;
					html += " unselectable='on' tabindex='-1' class='form-control wysiwyg-select'";
					html += 'ng-model="' + button + '" ';
					html += 'ng-options=" item for item in '+ button + '"';
					html += "ng-change='execCommand(\""+ button +"\")'";
					html+="><option ></option></select></div>";
					
				}
				
				return html;
			}
			scope.isActive = function(cmd){
	    		return document.queryCommandState(cmd);
	    	}

			//compile the template
			var toolbarGroups = [];
			angular.forEach(scope.toolbar, function(buttonGroup, index) {
				var buttons = [];
				angular.forEach(buttonGroup.items, function(button, index) {
					this.push( getButtonHtml(buttonGroup.name,button) );
				}, buttons);
				this.push(
					"<div class=\"btn-group btn-group-sm wysiwyg-btn-group-margin\">" +
					buttons.join('') +
					"</div>"
				);
			}, toolbarGroups);
			
			var template = editorTemplate.replace('{toolbar}', toolbarGroups.join(''));
			element.html( template );
			$compile(element.contents())(scope);
			
			scope.execCommand = function(cmd, arg) {
					if(cmd==='font'){
						cmd="fontname";
						arg=scope.font;
					}
					if(cmd==='size'){
						cmd="fontsize";
						arg=scope.size;
					}
					if(cmd==='image'){
						cmd="insertimage";
						arg=prompt('Enter the image URL');
					}
					if(cmd==='link'){
						cmd="createlink";
						arg=prompt("enter the link");
					}
					if(cmd==='fontColor'){
						cmd="forecolor";
						arg=scope.fontColor;
					}
					if(cmd==='backgroundColor'){
						cmd="hiliteColor";
						arg=scope.hiliteColor;
					}
					document.execCommand(cmd,true,arg);
			};
			
			
        },
    };
});