!function(t){function e(i){if(s[i])return s[i].exports;var n=s[i]={exports:{},id:i,loaded:!1};return t[i].call(n.exports,n,n.exports,e),n.loaded=!0,n.exports}var s={};return e.m=t,e.c=s,e.p="",e(0)}([function(t,e){t.exports={name:"post",el:"#post",data:function(){return _.merge({posts:!1,config:{filter:this.$session.get("posts.filter",{order:"date desc",limit:25})},pages:0,count:"",selected:[],canEditAll:!1},window.$data)},ready:function(){this.resource=this.$resource("api/blog/post{/id}"),this.$watch("config.page",this.load,{immediate:!0})},watch:{"config.filter":{handler:function(t){this.config.page?this.config.page=0:this.load(),this.$session.set("posts.filter",t)},deep:!0}},computed:{statusOptions:function(){var t=_.map(this.$data.statuses,function(t,e){return{text:t,value:e}});return[{label:this.$trans("Filter by"),options:t}]},authors:function(){var t=_.map(this.$data.authors,function(t){return{text:t.username,value:t.user_id}});return[{label:this.$trans("Filter by"),options:t}]}},methods:{active:function(t){return this.selected.indexOf(t.id)!=-1},save:function(t){this.resource.save({id:t.id},{post:t}).then(function(){this.load(),this.$notify("Post saved.")})},status:function(t){var e=this.getSelected();e.forEach(function(e){e.status=t}),this.resource.save({id:"bulk"},{posts:e}).then(function(){this.load(),this.$notify("Posts saved.")})},remove:function(){this.resource["delete"]({id:"bulk"},{ids:this.selected}).then(function(){this.load(),this.$notify("Posts deleted.")})},toggleStatus:function(t){t.status=2===t.status?3:2,this.save(t)},copy:function(){this.selected.length&&this.resource.save({id:"copy"},{ids:this.selected}).then(function(){this.load(),this.$notify("Posts copied.")})},load:function(){this.resource.query({filter:this.config.filter,page:this.config.page}).then(function(t){var e=t.data;this.$set("posts",e.posts),this.$set("pages",e.pages),this.$set("count",e.count),this.$set("selected",[])})},getSelected:function(){return this.posts.filter(function(t){return this.selected.indexOf(t.id)!==-1},this)},getStatusText:function(t){return this.statuses[t.status]}}},Vue.ready(t.exports)}]);