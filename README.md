# wysiwigEditor
Rich text editor with customized toolbars

Wysiwig Editor Architecture :

Used Angular JS 1.x for developing the editor .Following are the core components of the editor

1.RichtextDirective 
  --Generic template to load the toolbar .Toolbar can be configurable from outside
  --Customizable font editor .Form editor can be configurable from outside
  --Few issues with respect to the font editor.The dropdown collapese after choosing the value(In progress)
  
  
2.EditorController (API entry Point)
 --Provides input to the Editor 
  --Custom Configuration object can be created here for customizing the toolbar .
  --Custom property pane for each widget .Upon clicking on this dialogue box will open showing the properties of the selcted
    widget .(Yet to implement) .
   
