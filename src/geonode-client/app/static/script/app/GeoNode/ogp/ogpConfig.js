$(document).ready(function () {
    Ext.namespace("GeoNode");

    Ext.onReady(function(){
        GeoNode.queryTerms = {
            intx: "product(max(0,sub(min(180,max_x),max(-180,min_x))),max(0,sub(min(90,max_y),max(-90,min_y))))",
            sort: "score desc",
            //qf: "LayerTitleSynonyms^0.2 ThemeKeywordsSynonymsIso^0.1 ThemeKeywordsSynonymsLcsh^0.1 PlaceKeywordsSynonyms^0.1 Publisher^0.1 layer_originator^0.1 Abstract^0.2",
            fl: "id, uuid, name, title, abstract, min_x, min_y, max_x, max_y, layer_originator, is_public, url, service_type, bbox, location, layer_datetype, srs",
            qf: "title^1 abstract^0.2 layer_originator^1 layer_datetype^0.2",
            wt: "json",
            defType: "edismax",
            q: "*",
            fq: [
                "{!frange l=0 incl=false cache=false}$intx"
            ]
        };

        GeoNode.solrBackend = app.solrUrl;

        var solr = new GeoNode.Solr();
        solr.enableHeatmap();
        GeoNode.solr = solr;
    });
});
