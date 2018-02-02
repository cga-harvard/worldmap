Ext.namespace("GeoExt.ux");
GeoExt.ux.PrintPreview=Ext.extend(Ext.Container,{paperSizeText:"Paper size:",resolutionText:"Resolution:",printText:"Print",emptyTitleText:"Enter map title here.",includeLegendText:"Include legend?",emptyCommentText:"Enter comments here.",creatingPdfText:"Creating PDF...",printProvider:null,sourceMap:null,printMapPanel:null,mapTitleField:"mapTitle",commentField:"comment",legend:null,includeLegend:!1,mapTitle:null,comment:null,addMapOverlay:!0,busyMask:null,form:null,autoEl:"center",cls:"x-panel-body x-panel-body-noheader",
initComponent:function(){var a={sourceMap:this.sourceMap,printProvider:this.printProvider};if(this.printMapPanel){if(!(this.printMapPanel instanceof GeoExt.PrintMapPanel))a.xtype="gx_printmappanel",this.printMapPanel=new GeoExt.PrintMapPanel(Ext.applyIf(this.printMapPanel,a))}else this.printMapPanel=new GeoExt.PrintMapPanel(a);this.sourceMap=this.printMapPanel.sourceMap;this.printProvider=this.printMapPanel.printProvider;this.form=this.createForm();if(!this.items)this.items=[];this.items.push(this.createToolbar(),
{xtype:"container",cls:"gx-printpreview",autoHeight:this.autoHeight,autoWidth:this.autoWidth,items:[this.form,this.printMapPanel]});GeoExt.ux.PrintPreview.superclass.initComponent.call(this);this.addMapOverlay&&this.printMapPanel.add(this.createMapOverlay());this.printMapPanel.on({resize:this.updateSize,scope:this});this.on({render:function(){if(!this.busyMask)this.busyMask=new Ext.LoadMask(this.getEl(),{msg:this.creatingPdfText});this.printProvider.on({beforeprint:this.busyMask.show,print:this.busyMask.hide,
printexception:this.busyMask.hide,scope:this.busyMask})},scope:this})},createToolbar:function(){var a=[];1<this.printProvider.layouts.getCount()&&a.push(this.paperSizeText,{xtype:"combo",width:98,plugins:new GeoExt.plugins.PrintProviderField({printProvider:this.printProvider}),store:this.printProvider.layouts,displayField:"name",typeAhead:!0,mode:"local",forceSelection:!0,triggerAction:"all",selectOnFocus:!0},"&nbsp;");1<this.printProvider.dpis.getCount()&&a.push(this.resolutionText,{xtype:"combo",
width:62,plugins:new GeoExt.plugins.PrintProviderField({printProvider:this.printProvider}),store:this.printProvider.dpis,displayField:"name",tpl:'<tpl for="."><div class="x-combo-list-item">{name} dpi</div></tpl>',typeAhead:!0,mode:"local",forceSelection:!0,triggerAction:"all",selectOnFocus:!0,setValue:function(a){a=parseInt(a)+" dpi";Ext.form.ComboBox.prototype.setValue.apply(this,arguments)}},"&nbsp;");a.push("->",{text:this.printText,iconCls:"icon-print",handler:function(){this.printMapPanel.print(this.includeLegend&&
{legend:this.legend})},scope:this});return{xtype:"toolbar",items:a}},createForm:function(){var a={xtype:"textfield",name:this.mapTitleField,value:this.mapTitle,emptyText:this.emptyTitleText,margins:"0 5 0 0",flex:1,anchor:"100%",hideLabel:!0,plugins:new GeoExt.plugins.PrintProviderField({printProvider:this.printProvider})};if(this.legend)var b=new Ext.form.Checkbox({name:"legend",checked:this.includeLegend,boxLabel:this.includeLegendText,hideLabel:!0,ctCls:"gx-item-nowrap",handler:function(a,b){this.includeLegend=
b},scope:this});return new Ext.form.FormPanel({autoHeight:!0,border:!1,defaults:{anchor:"100%"},items:[this.legend?{xtype:"container",layout:"hbox",cls:"x-form-item",items:[a,b]}:a,{xtype:"textarea",name:this.commentField,value:this.comment,emptyText:this.emptyCommentText,hideLabel:!0,plugins:new GeoExt.plugins.PrintProviderField({printProvider:this.printProvider})}]})},createMapOverlay:function(){var a=new OpenLayers.Control.ScaleLine;this.printMapPanel.map.addControl(a);a.activate();return new Ext.Panel({cls:"gx-map-overlay",
layout:"column",width:235,bodyStyle:"padding:5px",items:[{xtype:"box",el:a.div,width:a.maxWidth},{xtype:"container",layout:"form",style:"padding: .2em 5px 0 0;",columnWidth:1,cls:"x-small-editor x-form-item",items:{xtype:"combo",name:"scale",anchor:"100%",hideLabel:!0,store:this.printMapPanel.previewScales,displayField:"name",typeAhead:!0,mode:"local",forceSelection:!0,triggerAction:"all",selectOnFocus:!0,getListParent:function(){return this.el.up(".x-window")||document.body},plugins:new GeoExt.plugins.PrintPageField({printPage:this.printMapPanel.printPage})}},
{xtype:"box",autoEl:{tag:"div",cls:"gx-northarrow"}}],listeners:{render:function(){function a(b){b.stopPropagation()}this.getEl().on({click:a,dblclick:a,mousedown:a})}}})},updateSize:function(){this.suspendEvents();var a=this.printMapPanel.getWidth();this.form.setWidth(a);this.form.items.get(0).setWidth(a);var b=this.initialConfig.minWidth||0;this.items.get(0).setWidth(this.form.ownerCt.el.getPadding("lr")+Math.max(a,b));(a=this.ownerCt)&&a instanceof Ext.Window&&this.ownerCt.syncShadow();this.resumeEvents()},
beforeDestroy:function(){this.busyMask&&(this.printProvider.un("beforeprint",this.busyMask.show,this.busyMask),this.printProvider.un("print",this.busyMask.hide,this.busyMask));this.printMapPanel.un("resize",this.updateSize,this);GeoExt.ux.PrintPreview.superclass.beforeDestroy.apply(this,arguments)}});Ext.reg("gxux_printpreview",GeoExt.ux.PrintPreview);