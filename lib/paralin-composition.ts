export type Building={id:string;file:string;x:number;y:number;scale:number;layer:number;label:string};
export const catalog=[
["shop","commercial/corner-shop/paralin-shop-corner-01-base.png","Corner shop"],
["mixed","mixed-use/restaurant-residence/paralin-mixed-use-restaurant-residence-01-base.png","Restaurant / residence"],
["yellow","residential/small-single-storey/paralin-house-small-01-base.png","Yellow house"],
["blue","residential/small-single-storey/paralin-house-small-02-base.png","Blue house"],
["coral","residential/small-single-storey/paralin-house-small-03-base.png","Coral house"],
["raised","residential/raised/paralin-house-raised-01-base.png","Raised house"],
["two","residential/two-storey/paralin-house-two-storey-01-base.png","Two-storey house"],
["hill","residential/hillside/paralin-house-hillside-01-base.png","Hillside assembly"]
] as const;
export const initial:Building[]=[
{id:"shop-1",file:catalog[0][1],x:68,y:53,scale:.22,layer:3,label:"Corner Shop"},
{id:"mixed-1",file:catalog[1][1],x:24,y:42,scale:.22,layer:2,label:"Restaurant"},
{id:"house-1",file:catalog[2][1],x:15,y:19,scale:.19,layer:1,label:"Home"},
{id:"house-2",file:catalog[3][1],x:49,y:17,scale:.19,layer:1,label:"Home"},
{id:"house-3",file:catalog[6][1],x:81,y:23,scale:.18,layer:1,label:"Home"}
];


export const dimensions: Record<string,{width:number;height:number}> = {"residential/hillside/paralin-house-hillside-01-base.png": {"width": 1536, "height": 1024}, "residential/hillside/paralin-house-hillside-01-pink.png": {"width": 1536, "height": 1024}, "residential/hillside/paralin-house-hillside-02-blue.png": {"width": 1536, "height": 1024}, "residential/raised/paralin-house-raised-01-base.png": {"width": 1536, "height": 1024}, "residential/raised/paralin-house-raised-02-base.png": {"width": 1536, "height": 1024}, "residential/raised/paralin-house-raised-03-base.png": {"width": 1536, "height": 1024}, "residential/small-single-storey/paralin-house-small-01-base.png": {"width": 1536, "height": 1024}, "residential/small-single-storey/paralin-house-small-02-base.png": {"width": 1536, "height": 1024}, "residential/small-single-storey/paralin-house-small-03-base.png": {"width": 1536, "height": 1024}, "residential/two-storey/paralin-house-two-storey-01-base.png": {"width": 1536, "height": 1024}, "residential/two-storey/paralin-house-two-storey-02-pink.png": {"width": 1536, "height": 1024}, "residential/two-storey/paralin-house-two-storey-03-blue.png": {"width": 1536, "height": 1024}, "mixed-use/restaurant-residence/paralin-mixed-use-restaurant-residence-01-base.png": {"width": 1312, "height": 1199}, "mixed-use/restaurant-residence/paralin-mixed-use-restaurant-residence-02-coral.png": {"width": 1312, "height": 1199}, "mixed-use/restaurant-residence/paralin-mixed-use-restaurant-residence-03-blue.png": {"width": 1312, "height": 1199}, "commercial/corner-shop/paralin-shop-corner-01-base.png": {"width": 1536, "height": 1024}, "commercial/corner-shop/paralin-shop-corner-02-green.png": {"width": 1536, "height": 1024}, "commercial/corner-shop/paralin-shop-corner-03-blue.png": {"width": 1536, "height": 1024}};
